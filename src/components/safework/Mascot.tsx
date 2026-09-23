// Boneco guia montado a partir de 4 recortes (cabeça, tronco, braço direito, pernas) —
// ver public/cabeça.png, tronco.png, braçoDireito.png, pernas.png. Números de tamanho e
// posição foram ajustados olhando o resultado renderizado (não dá pra calcular isso só
// pela proporção do canvas de cada imagem, já que cada uma foi gerada em uma sessão de IA
// separada e não vem no mesmo "grid" de proporções).
export function Mascot({ pointing = false, className = "" }: { pointing?: boolean; className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ width: 220, height: 580 }}>
      {/* Tronco e pernas nasceram no mesmo tamanho de tela (1024x1536), então usar a MESMA
          largura de exibição pras duas mantém a escala consistente entre elas — sem isso uma
          ficava "maior" que a outra proporcionalmente. */}
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
        style={{ width: 150, top: 335 }}
      />
      {/* Braço direito — pivô no ombro (origin-top), gira pra apontar. Fica invisível em
          repouso porque o tronco já tem o próprio braço direito desenhado nele; sem o fade,
          a textura do braço solto (gerado em outra sessão de IA) cria uma costura visível
          sobreposta ao braço do tronco. */}
      <img
        src="/braçoDireito.png"
        alt=""
        className="absolute origin-top transition-all duration-700 ease-out"
        style={{
          width: 55,
          top: 173,
          left: 57,
          opacity: pointing ? 1 : 0,
          transform: pointing ? "rotate(80deg)" : "rotate(0deg)",
        }}
      />
      {/* Cabeça — por cima de tudo */}
      <img
        src="/cabeça.png"
        alt=""
        className="absolute left-1/2 top-0 -translate-x-1/2"
        style={{ width: 112 }}
      />
    </div>
  );
}
