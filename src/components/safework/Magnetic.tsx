import { useRef, type MouseEvent, type ReactNode } from "react";

// Puxa o conteúdo (normalmente um botão) em direção ao cursor enquanto ele passa por cima —
// solta de volta ao centro ao sair. `strength` baixo (0.2–0.4) mantém o efeito sutil, não
// um botão "fugindo" do dedo.
export function Magnetic({
  strength = 0.3,
  className = "",
  children,
}: {
  strength?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${(x * strength).toFixed(1)}px, ${(y * strength).toFixed(1)}px)`;
  };

  const onMouseLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0, 0)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`inline-block transition-transform duration-200 ease-out ${className}`}
    >
      {children}
    </div>
  );
}
