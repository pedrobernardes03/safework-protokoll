import { useEffect, useState } from "react";
import { Maximize2 } from "lucide-react";

export interface Guarantee {
  title: string;
  desc: string;
  image: string;
}

// Faixas coladas que expandem a que está em foco e encolhem o resto — a foto é
// preto-e-branco em repouso e só ganha cor quando a faixa é a ativa. Só existe no
// computador, onde o mouse decide qual expande.
function GuaranteeStrip({
  item,
  active,
  onHover,
}: {
  item: Guarantee;
  active: boolean;
  onHover?: () => void;
}) {
  return (
    <div
      onMouseEnter={onHover}
      style={{ flexGrow: active ? 6 : 1, flexBasis: 0 }}
      className="relative h-80 min-w-0 shrink-0 overflow-hidden rounded-2xl shadow-lg shadow-slate-900/10 transition-[flex-grow] duration-500 ease-out"
    >
      <div
        aria-hidden="true"
        className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out ${
          active ? "scale-100 grayscale-0" : "scale-110 grayscale"
        }`}
        style={{ backgroundImage: `url(${item.image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-slate-950/10" />

      {/* Recolhido: só o título, em pé (writing-mode de verdade, não rotate hack) — sinaliza
          que tem mais ali sem precisar de seta ou ícone. Expandido: título deitado, com a
          descrição embaixo dele (empilhado, não lado a lado, pra não estourar a borda do
          card quando a faixa ainda está estreita no meio da transição). */}
      <div className="absolute inset-0 flex items-end overflow-hidden p-5">
        <div className="flex min-w-0 flex-col">
          <h3
            className={`w-fit font-bold text-white ${
              active ? "text-lg [writing-mode:horizontal-tb]" : "text-sm [writing-mode:vertical-rl] rotate-180"
            }`}
          >
            {item.title}
          </h3>
          {active && (
            <p className="mt-2 animate-in fade-in-0 duration-300 [animation-delay:150ms] [animation-fill-mode:both] text-sm leading-relaxed text-white/75">
              {item.desc}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Card do grid 2x2 do celular — em repouso é só a foto preto-e-branco (menor, só com o
// título) com um ícone pulsando pra sinalizar que dá pra tocar. Tocar expande aquele card
// (fica mais alto) e revela a cor + a descrição; tocar de novo recolhe. Cada card guarda
// seu próprio estado, sem afetar os vizinhos.
function GuaranteeGridCard({ item }: { item: Guarantee }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setExpanded((v) => !v)}
      aria-expanded={expanded}
      className={`relative w-full overflow-hidden rounded-2xl text-left shadow-lg shadow-slate-900/10 transition-[height] duration-500 ease-out ${
        expanded ? "h-64" : "h-32"
      }`}
    >
      <div
        aria-hidden="true"
        className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ease-out ${
          expanded ? "grayscale-0" : "grayscale"
        }`}
        style={{ backgroundImage: `url(${item.image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-slate-950/5" />

      {/* Chama atenção pro toque enquanto recolhido — some assim que expande, já que a
          descrição aparecendo já confirma que a interação funcionou. */}
      {!expanded && (
        <span className="absolute right-3 top-3 grid h-7 w-7 animate-bounce-subtle place-items-center rounded-full bg-white/20 backdrop-blur-sm">
          <Maximize2 className="h-3.5 w-3.5 animate-wiggle-loop text-white" />
        </span>
      )}

      <div className="absolute inset-0 flex flex-col justify-end p-4">
        <h3 className="text-sm font-bold text-white">{item.title}</h3>
        {expanded && (
          <p className="mt-1.5 animate-in fade-in-0 duration-300 [animation-delay:150ms] [animation-fill-mode:both] text-xs leading-relaxed text-white/75">
            {item.desc}
          </p>
        )}
      </div>
    </button>
  );
}

export function GuaranteesShowcase({ items }: { items: readonly Guarantee[] }) {
  const [isDesktop, setIsDesktop] = useState(true);
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!isDesktop) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <GuaranteeGridCard key={item.title} item={item} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-3" onMouseLeave={() => setHovering(false)}>
      {items.map((item, i) => (
        <GuaranteeStrip
          key={item.title}
          item={item}
          active={hovering ? i === active : false}
          onHover={() => {
            setHovering(true);
            setActive(i);
          }}
        />
      ))}
    </div>
  );
}
