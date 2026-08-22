import { useEffect, useRef } from "react";

type LayerState = { scale: number; x: number; y: number };

const FULL: LayerState = { scale: 1, x: 0.5, y: 0.5 };

const topics = [
  {
    side: "left" as const,
    stage: 1,
    eyebrow: "Checklist diário",
    title: "Cada EPI confirmado em segundos.",
    desc: "O colaborador confere o uso do capacete direto do celular, sem planilha, antes de começar o turno.",
    scale: 3.3,
    x: 0.513,
    y: 0.135,
  },
  {
    side: "right" as const,
    stage: 3,
    eyebrow: "Check-in inteligente",
    title: "Reconhecimento facial na entrada.",
    desc: "Cada colaborador confirma presença por biometria facial, já vinculada ao checklist de EPIs do turno.",
    scale: 3.6,
    x: 0.52,
    y: 0.19,
  },
  {
    side: "left" as const,
    stage: 5,
    eyebrow: "Entrega e troca",
    title: "Sem burocracia para repor um EPI.",
    desc: "Luvas danificadas? O colaborador reporta e o almoxarifado já vê a solicitação, sem papel.",
    scale: 2.9,
    x: 0.26,
    y: 0.405,
  },
  {
    side: "right" as const,
    stage: 7,
    eyebrow: "Identificação em campo",
    title: "Conformidade visível de longe.",
    desc: "Coletes e crachás digitais dão ao gestor uma leitura instantânea de quem está protegido.",
    scale: 3.1,
    x: 0.507,
    y: 0.37,
  },
  {
    side: "left" as const,
    stage: 9,
    eyebrow: "Histórico completo",
    title: "Pronto para qualquer auditoria.",
    desc: "Da botina ao capacete, cada troca fica registrada — exportável a qualquer momento.",
    scale: 3.0,
    x: 0.513,
    y: 0.8,
  },
];

const keyframes: LayerState[] = [
  FULL,
  topics[0],
  FULL,
  topics[1],
  FULL,
  topics[2],
  FULL,
  topics[3],
  FULL,
  topics[4],
  FULL,
];

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function stageValues(progress: number) {
  const segments = keyframes.length - 1;
  const raw = Math.min(Math.max(progress, 0), 1) * segments;
  const idx = Math.min(Math.floor(raw), segments - 1);
  const frac = smoothstep(raw - idx);
  const a = keyframes[idx];
  const b = keyframes[idx + 1];
  const value: LayerState = {
    scale: lerp(a.scale, b.scale, frac),
    x: lerp(a.x, b.x, frac),
    y: lerp(a.y, b.y, frac),
  };
  return { value, rawStage: raw };
}

function DesktopShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const panelRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = sectionRef.current;
      const img = imgRef.current;
      if (el && img) {
        const rect = el.getBoundingClientRect();
        const total = el.offsetHeight - window.innerHeight;
        const scrolled = -rect.top;
        const progress = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0;
        const { value, rawStage } = stageValues(progress);

        // Zoom to a point with transform-origin pinned at the top-left (0 0): scale first
        // (blowing the target point up and away from the corner), then translate by
        // (50% - scale*targetFraction) so that point lands exactly at the container's
        // center. (The center-origin version of this math looked simpler but didn't
        // actually work out — verified by hand: this corner-origin form does.)
        img.style.transformOrigin = "0 0";
        const txPercent = 50 - 100 * value.scale * value.x;
        const tyPercent = 50 - 100 * value.scale * value.y;
        img.style.transform = `translate(${txPercent}%, ${tyPercent}%) scale(${value.scale})`;

        panelRefs.forEach((ref, i) => {
          const node = ref.current;
          if (!node) return;
          // A narrower, smoothstep-eased window than the zoom's own transition, so the text
          // only reveals once the zoom has mostly landed — reads as "arrive, then reveal"
          // instead of both animating at once and feeling loosely synced.
          const dist = Math.abs(rawStage - topics[i].stage);
          const t = Math.max(0, 1 - dist / 0.4);
          const opacity = smoothstep(t);
          const side = topics[i].side === "left" ? -1 : 1;
          node.style.opacity = String(opacity);
          node.style.transform = `translateX(${(1 - opacity) * 16 * side}px)`;
          node.style.pointerEvents = opacity > 0.5 ? "auto" : "none";
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={sectionRef} className="relative hidden lg:block" style={{ height: "560vh" }}>
      <div className="sticky top-24 mx-auto h-[min(72vh,640px)] max-w-7xl px-6">
        <div className="relative h-full">
          {topics.map((topic, i) => (
            <div
              key={topic.title}
              ref={panelRefs[i]}
              className={`absolute top-1/2 w-full max-w-xs -translate-y-1/2 ${topic.side === "left" ? "left-0 text-left" : "right-0 text-right"}`}
              style={{ opacity: 0 }}
            >
              <div
                className={`inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ${topic.side === "right" ? "flex-row-reverse" : ""}`}
              >
                {topic.eyebrow}
              </div>
              <h3 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-3xl">
                {topic.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base">{topic.desc}</p>
            </div>
          ))}

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {/* A real photo with its own environment (rooftop, sky, city view) instead of a
                cutout on a fake blurred backdrop — no compositing needed, it already reads
                as a real place. Card aspect must stay pixel-matched to the source photo
                (3:4) since the zoom math below measures targets as fractions of this box. */}
            <div className="relative aspect-[3/4] h-full overflow-hidden rounded-[2.5rem] shadow-2xl shadow-slate-900/25">
              <img
                ref={imgRef}
                src="/worker.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileShowcase() {
  return (
    <div className="block space-y-10 lg:hidden">
      <div className="mx-auto h-72 w-full max-w-sm sm:h-80">
        <img src="/worker.jpg" alt="Colaborador com EPIs completos" className="mx-auto h-full rounded-3xl object-cover shadow-xl" />
      </div>
      <div className="space-y-8 px-1">
        {topics.map((topic) => (
          <div key={topic.title} className="text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {topic.eyebrow}
            </div>
            <h3 className="mt-3 text-xl font-extrabold leading-tight tracking-tight text-slate-900">
              {topic.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{topic.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CharacterShowcase() {
  return (
    <>
      <DesktopShowcase />
      <MobileShowcase />
    </>
  );
}
