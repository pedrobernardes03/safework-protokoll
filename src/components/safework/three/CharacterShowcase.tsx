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
    scale: 6.5,
    x: 0.454,
    y: 0.19,
  },
  {
    side: "right" as const,
    stage: 3,
    eyebrow: "Check-in inteligente",
    title: "Reconhecimento facial na entrada.",
    desc: "Cada colaborador confirma presença por biometria facial, já vinculada ao checklist de EPIs do turno.",
    scale: 6.0,
    x: 0.454,
    y: 0.22,
  },
  {
    side: "left" as const,
    stage: 5,
    eyebrow: "Identificação em campo",
    title: "Conformidade visível de longe.",
    desc: "Coletes e crachás digitais dão ao gestor uma leitura instantânea de quem está protegido.",
    scale: 3.0,
    x: 0.48,
    y: 0.35,
  },
  {
    side: "right" as const,
    stage: 7,
    eyebrow: "Histórico completo",
    title: "Pronto para qualquer auditoria.",
    desc: "Da botina ao capacete, cada troca fica registrada — exportável a qualquer momento.",
    scale: 3.3,
    x: 0.517,
    y: 0.845,
  },
  {
    side: "left" as const,
    stage: 9,
    eyebrow: "Visão geral",
    title: "Todo o EPI, em uma só tela.",
    desc: "Do capacete à bota, o gestor acompanha o conjunto completo de proteção em tempo real.",
    scale: 1.3,
    x: 0.454,
    y: 0.4,
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

// Um único componente, ativo em qualquer largura — antes o efeito de zoom por scroll só
// rodava em telas grandes (`hidden lg:block`) e o celular via uma lista estática sem
// nenhuma animação. Como a maior parte de quem visita o site vem do celular, o efeito
// precisa existir ali também, só que com a legenda embaixo da foto em vez de do lado
// (não tem espaço sobrando nas laterais numa tela estreita).
function CharacterShowcaseInner() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const panelRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const mobilePanelRefs = [
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

        [panelRefs, mobilePanelRefs].forEach((refs) => {
          refs.forEach((ref, i) => {
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
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={sectionRef} className="relative" style={{ height: "560vh" }}>
      <div className="sticky top-16 mx-auto flex h-[92vh] max-w-7xl flex-col justify-center px-6 sm:top-20 lg:h-[min(72vh,640px)] lg:justify-normal">
        <div className="relative lg:h-full">
          {/* Legendas ao lado — só em telas grandes, onde tem espaço nas laterais da foto. */}
          {topics.map((topic, i) => (
            <div
              key={topic.title}
              ref={panelRefs[i]}
              className={`absolute top-1/2 hidden w-full max-w-xs -translate-y-1/2 lg:block ${topic.side === "left" ? "left-0 text-left" : "right-0 text-right"}`}
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

          <div className="pointer-events-none flex h-[54vh] items-center justify-center sm:h-[58vh] lg:absolute lg:inset-0 lg:h-auto">
            {/* A real photo with its own environment (street, hills, city skyline) instead of a
                cutout on a fake blurred backdrop — no compositing needed, it already reads
                as a real place. Card aspect must stay pixel-matched to the source photo
                (2:3, a full-body shot) since the zoom math below measures targets as
                fractions of this box. */}
            <div className="relative aspect-[2/3] h-full max-w-[80vw] overflow-hidden rounded-[2rem] shadow-2xl shadow-slate-900/25 lg:max-w-none lg:rounded-[2.5rem]">
              <img
                ref={imgRef}
                src="/worker.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Legenda embaixo da foto — só em telas pequenas/médias, trocando com o mesmo fade
            calculado acima em vez de repetir o layout lateral do desktop espremido. */}
        <div className="relative mt-5 h-32 shrink-0 sm:h-28 lg:hidden">
          {topics.map((topic, i) => (
            <div
              key={topic.title}
              ref={mobilePanelRefs[i]}
              className="absolute inset-x-0 top-0 text-center"
              style={{ opacity: 0 }}
            >
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {topic.eyebrow}
              </div>
              <h3 className="mt-3 text-lg font-extrabold leading-tight tracking-tight text-slate-900 sm:text-xl">
                {topic.title}
              </h3>
              <p className="mx-auto mt-1.5 max-w-xs text-xs leading-relaxed text-slate-500 sm:text-sm">{topic.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CharacterShowcase() {
  return <CharacterShowcaseInner />;
}
