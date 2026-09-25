import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";

// Só nas páginas de marketing — a área logada (gestor/colaborador) é uma ferramenta de
// trabalho usada o dia inteiro, um cursor customizado ali seria novidade que cansa, não
// imersão. Vive no __root.tsx (fora de cada página) pra não precisar ser importado em
// cada rota de marketing separadamente.
const MARKETING_PATHS = new Set(["/", "/sobre", "/solucoes", "/planos"]);

// Distância mínima (px) entre uma partícula do rastro e a próxima — controla a densidade.
const TRAIL_MIN_DISTANCE = 6;
const TRAIL_LIFETIME_MS = 750;
// Pool fixo de elementos reaproveitados em vez de criar/destruir um <span> a cada poucos
// pixels de movimento — era a causa das engasgadas: em um movimento rápido de mouse isso
// chegava a centenas de createElement/remove por segundo, cada um forçando layout/GC. Com
// o pool, o número de nós do rastro no DOM é sempre o mesmo (20), só a posição/opacidade
// deles muda via Web Animations API (roda no compositor, não recalcula layout).
const TRAIL_POOL_SIZE = 20;

export function CustomCursor() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const active = MARKETING_PATHS.has(pathname);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    // Dispositivo touch não tem "hover" de verdade — não faz sentido substituir o cursor.
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const layer = trailLayerRef.current;
    if (!layer) return;

    const pool: HTMLSpanElement[] = [];
    for (let i = 0; i < TRAIL_POOL_SIZE; i++) {
      const dot = document.createElement("span");
      dot.className = "cursor-trail-dot";
      dot.style.opacity = "0";
      layer.appendChild(dot);
      pool.push(dot);
    }
    let poolIndex = 0;

    // 'dark' = está sobre uma seção marcada com data-cursor-zone="dark" (vídeo do hero,
    // painel escuro de Soluções) — sem isso, sobre fundo claro o cursor claro sumia e
    // vice-versa. Fica em variável comum (não state) porque muda pouco e não precisa
    // re-render do React.
    let zone: "light" | "dark" = "light";
    let lastTrailX = 0;
    let lastTrailY = 0;
    let visible = false;

    const applyZone = () => {
      ringRef.current?.classList.toggle("cursor-ring--dark", zone === "dark");
      trailLayerRef.current?.classList.toggle("cursor-trail--dark", zone === "dark");
    };

    const spawnTrailParticle = (x: number, y: number) => {
      const dot = pool[poolIndex];
      poolIndex = (poolIndex + 1) % pool.length;
      const size = 10 + Math.random() * 10;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      // getAnimations/animate cancela sozinho qualquer animação anterior nesse elemento ao
      // chamar animate() de novo — reaproveitar o nó não deixa "sobras" de frames antigos.
      dot.animate(
        [
          { opacity: 0.65, transform: "translate(-50%, -50%) scale(1)" },
          { opacity: 0, transform: "translate(-50%, -50%) scale(0.2)" },
        ],
        { duration: TRAIL_LIFETIME_MS, easing: "ease-out", fill: "forwards" },
      );
    };

    const onMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }
      if (!visible) {
        visible = true;
        ringRef.current?.classList.add("cursor-ring--visible");
        trailLayerRef.current?.classList.add("cursor-trail--visible");
      }

      const dx = x - lastTrailX;
      const dy = y - lastTrailY;
      if (dx * dx + dy * dy > TRAIL_MIN_DISTANCE * TRAIL_MIN_DISTANCE) {
        lastTrailX = x;
        lastTrailY = y;
        spawnTrailParticle(x, y);
      }
    };
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const hoveringInteractive = !!target?.closest("a, button, [data-cursor='hover']");
      ringRef.current?.classList.toggle("cursor-ring--hover", hoveringInteractive);

      const newZone = target?.closest('[data-cursor-zone="dark"]') ? "dark" : "light";
      if (newZone !== zone) {
        zone = newZone;
        applyZone();
      }
    };
    const onWindowLeave = () => {
      visible = false;
      ringRef.current?.classList.remove("cursor-ring--visible");
      trailLayerRef.current?.classList.remove("cursor-trail--visible");
    };
    const onWindowEnter = () => {
      visible = true;
      ringRef.current?.classList.add("cursor-ring--visible");
      trailLayerRef.current?.classList.add("cursor-trail--visible");
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onWindowLeave);
    document.documentElement.addEventListener("mouseenter", onWindowEnter);
    document.body.classList.add("cursor-none-marketing");

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onWindowLeave);
      document.documentElement.removeEventListener("mouseenter", onWindowEnter);
      document.body.classList.remove("cursor-none-marketing");
      layer.innerHTML = "";
    };
  }, [active]);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[200]" aria-hidden>
      <div ref={trailLayerRef} className="cursor-trail-layer fixed inset-0" />
      <div ref={ringRef} className="cursor-ring fixed left-0 top-0" />
    </div>
  );
}
