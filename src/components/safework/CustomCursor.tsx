import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

// Só nas páginas de marketing — a área logada (gestor/colaborador) é uma ferramenta de
// trabalho usada o dia inteiro, um cursor customizado ali seria novidade que cansa, não
// imersão. Vive no __root.tsx (fora de cada página) pra não precisar ser importado em
// cada rota de marketing separadamente.
const MARKETING_PATHS = new Set(["/", "/sobre", "/solucoes", "/planos"]);

export function CustomCursor() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const active = MARKETING_PATHS.has(pathname);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
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
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
      setVisible((v) => v || true);
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
    };
  }, [active]);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[200]" aria-hidden>
      <div
        ref={dotRef}
        className={`fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-primary transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`}
      />
      <div
        ref={ringRef}
        className={`fixed left-0 top-0 rounded-full border transition-[width,height,opacity,border-color,background-color] duration-200 ease-out ${
          visible ? "opacity-100" : "opacity-0"
        } ${hovering ? "h-12 w-12 border-primary bg-primary/10" : "h-7 w-7 border-primary/40 bg-transparent"}`}
      />
    </div>
  );
}
