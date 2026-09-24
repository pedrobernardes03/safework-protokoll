import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

// Só nas páginas de marketing — a área logada (gestor/colaborador) é uma ferramenta de
// trabalho usada o dia inteiro, um cursor customizado ali seria novidade que cansa, não
// imersão. Vive no __root.tsx (fora de cada página) pra não precisar ser importado em
// cada rota de marketing separadamente.
const MARKETING_PATHS = new Set(["/", "/sobre", "/solucoes", "/planos"]);

// Distância mínima (px) entre um rastro e o próximo — evita spawnar uma partícula a cada
// pixel de movimento (centenas por segundo em mouse rápido), só quando o cursor já andou o
// suficiente pra valer a pena marcar o caminho.
const TRAIL_MIN_DISTANCE = 14;
const TRAIL_LIFETIME_MS = 650;

export function CustomCursor() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const active = MARKETING_PATHS.has(pathname);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailLayerRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) return;
    // Dispositivo touch não tem "hover" de verdade — não faz sentido substituir o cursor.
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let lastTrailX = 0;
    let lastTrailY = 0;
    let raf = 0;

    const spawnTrailParticle = (x: number, y: number) => {
      const layer = trailLayerRef.current;
      if (!layer) return;
      const dot = document.createElement("span");
      dot.className = "cursor-trail-dot";
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      layer.appendChild(dot);
      window.setTimeout(() => dot.remove(), TRAIL_LIFETIME_MS);
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
      setVisible((v) => v || true);

      const dx = mouseX - lastTrailX;
      const dy = mouseY - lastTrailY;
      if (dx * dx + dy * dy > TRAIL_MIN_DISTANCE * TRAIL_MIN_DISTANCE) {
        lastTrailX = mouseX;
        lastTrailY = mouseY;
        spawnTrailParticle(mouseX, mouseY);
      }
    };
    // O anel persegue o ponto com atraso (lerp) — o ponto central acompanha o mouse 1:1,
    // dando a sensação de um cursor "vivo" em vez de travado no pixel exato.
    const loop = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };
    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest("a, button, [data-cursor='hover']");
      setHovering(!!target);
    };
    const onWindowLeave = () => setVisible(false);
    const onWindowEnter = () => setVisible(true);

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.documentElement.addEventListener("mouseleave", onWindowLeave);
    document.documentElement.addEventListener("mouseenter", onWindowEnter);
    document.body.classList.add("cursor-none-marketing");
    raf = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onWindowLeave);
      document.documentElement.removeEventListener("mouseenter", onWindowEnter);
      document.body.classList.remove("cursor-none-marketing");
      cancelAnimationFrame(raf);
      setVisible(false);
      if (trailLayerRef.current) trailLayerRef.current.innerHTML = "";
    };
  }, [active]);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[200]" aria-hidden>
      {/* mix-blend-difference inverte contra o que está por baixo — por isso o cursor (e o
          rastro) sempre aparece com contraste, tanto em seção clara quanto no vídeo/painel
          escuro, sem precisar detectar a cor de fundo de cada trecho da página. */}
      <div ref={trailLayerRef} className="fixed inset-0" />
      <div
        ref={dotRef}
        className={`fixed left-0 top-0 h-2 w-2 rounded-full bg-white mix-blend-difference transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`}
      />
      <div
        ref={ringRef}
        className={`fixed left-0 top-0 rounded-full border border-white bg-white/10 mix-blend-difference transition-[width,height,opacity] duration-200 ease-out ${
          visible ? "opacity-100" : "opacity-0"
        } ${hovering ? "h-12 w-12" : "h-7 w-7"}`}
      />
    </div>
  );
}
