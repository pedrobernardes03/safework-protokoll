import { useEffect, useState } from "react";

// Boneco guia montado a partir de 4 recortes (cabeça, tronco, braço direito, pernas) —
// ver public/cabeça.png, tronco.png, braçoDireito.png, pernas.png. Números de tamanho e
// posição foram ajustados medindo o conteúdo real de cada PNG (via canvas) contra o
// resultado renderizado, não só o tamanho do canvas de cada imagem — cada uma foi gerada
// em uma sessão de IA separada e não vem no mesmo "grid" de proporções nem com a mesma
// margem transparente ao redor.
//
// Sem animação contínua de propósito: o boneco fica parado numa pose e só se mexe quando
// o `pointing` muda (ex: ao trocar de etapa no HowItWorksOverlay, que remonta este
// componente com uma `key` nova) — ficar balançando o tempo todo foi removido a pedido.
export function Mascot({ pointing = false, className = "" }: { pointing?: boolean; className?: string }) {
  // O braço só ergue pra apontar depois de um instante — sem esse atraso o componente já
  // nasceria com o braço na posição final e a transição não teria um estado "de antes" pra
  // animar a partir dele, perdendo o gesto de erguer o braço.
  const [armUp, setArmUp] = useState(false);
  useEffect(() => {
    if (!pointing) {
      setArmUp(false);
      return;
    }
    const t = setTimeout(() => setArmUp(true), 150);
    return () => clearTimeout(t);
  }, [pointing]);

  return (
    <div className={`relative animate-pop-in ${className}`} style={{ width: 220, height: 580 }}>
      {/* Tronco e pernas nasceram no mesmo tamanho de tela (1024x1536), então usar a MESMA
          largura de exibição pras duas mantém a escala consistente entre elas — sem isso uma
          ficava "maior" que a outra proporcionalmente. O `top` das pernas foi calibrado pra
          encostar na barra da veste (não na ponta da manga do braço esquerdo, que já vem
          desenhado no tronco e desce bem mais abaixo da barra real). */}
      <img
        src="/tronco.png"
        alt=""
        className="absolute left-1/2 -translate-x-1/2"
        style={{ width: 150, top: 130 }}
      />
      <img
        src="/pernas.png"
        alt=""
        className="absolute left-1/2 -translate-x-1/2"
        style={{ width: 150, top: 310 }}
      />
      {/* Braço direito — pivô no ombro (origin-top). Fica invisível em repouso porque o
          tronco já tem o próprio braço direito desenhado nele; sem o fade, a textura do
          braço solto (gerado em outra sessão de IA) cria uma costura visível sobreposta ao
          braço do tronco. */}
      <img
        src="/braçoDireito.png"
        alt=""
        className="absolute origin-top transition-all duration-700 ease-out"
        style={{
          width: 55,
          top: 173,
          left: 57,
          opacity: armUp ? 1 : 0,
          transform: armUp ? "rotate(80deg)" : "rotate(0deg)",
        }}
      />
      {/* Cabeça — por cima de tudo. O `top` foi descido o suficiente pra a gola da cabeça
          encostar na gola do tronco (medido via canvas: sem esse ajuste sobrava uma faixa
          vazia de ~38px entre as duas, fazendo parecer duas golas soltas e não uma só). */}
      <img
        src="/cabeça.png"
        alt=""
        className="absolute left-1/2 -translate-x-1/2"
        style={{ width: 112, top: 42 }}
      />
    </div>
  );
}
