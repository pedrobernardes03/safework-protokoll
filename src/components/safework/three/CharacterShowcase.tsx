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
    scale: 3.4,
    x: 0.5,
    y: 0.06,
  },
  {
    side: "right" as const,
    stage: 3,
    eyebrow: "Saúde ocupacional",
    title: "Proteção respiratória sempre em dia.",
    desc: "Máscaras e trocas programadas ficam visíveis para o time de segurança do trabalho, sem esquecimentos.",
    scale: 3.6,
    x: 0.5,
    y: 0.14,
  },
  {
    side: "left" as const,
    stage: 5,
    eyebrow: "Entrega e troca",
    title: "Sem burocracia para repor um EPI.",
    desc: "Luvas danificadas? O colaborador reporta e o almoxarifado já vê a solicitação, sem papel.",
    scale: 3.2,
    x: 0.81,
    y: 0.46,
  },
  {
    side: "right" as const,
    stage: 7,
    eyebrow: "Identificação em campo",
    title: "Conformidade visível de longe.",
    desc: "Coletes e crachás digitais dão ao gestor uma leitura instantânea de quem está protegido.",
    scale: 2.7,
    x: 0.5,
    y: 0.3,
  },
  {
    side: "left" as const,
    stage: 9,
    eyebrow: "Histórico completo",
    title: "Pronto para qualquer auditoria.",
    desc: "Da botina ao capacete, cada troca fica registrada — exportável a qualquer momento.",
    scale: 2.6,
    x: 0.44,
    y: 0.92,
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

        // Keep transform-origin at dead center and do the "zoom to point" by translating
        // the target fraction to the middle before scaling — setting transform-origin to
        // the target point instead (the more obvious-looking approach) pins that point at
        // its original screen position rather than moving it to center, which left the
        // zoomed subject sitting off to one side instead of framed in the middle.
        const tx = -(value.x - 0.5) * 100;
        const ty = -(value.y - 0.5) * 100;
        img.style.transform = `scale(${value.scale}) translate(${tx}%, ${ty}%)`;

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
              className={`absolute top-1/2 w-full max-w-sm -translate-y-1/2 ${topic.side === "left" ? "left-0 text-left" : "right-0 text-right"}`}
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
            <div className="relative aspect-[408/612] h-full overflow-hidden">
              <img
                ref={imgRef}
                src="/worker.png"
                alt=""
                className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_18px_30px_rgba(15,23,42,0.18)]"
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
        <img src="/worker.png" alt="Colaborador com EPIs completos" className="mx-auto h-full object-contain" />
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
