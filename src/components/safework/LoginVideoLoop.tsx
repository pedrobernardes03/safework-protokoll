import { useEffect, useRef, useState } from "react";

// Três cenas em sequência com crossfade, mesmo mecanismo do HeroVideoLoop (Recursos) — mas
// com clipes PRÓPRIOS do login, nenhum reaproveitado da página inicial: mostrar acesso ao
// local de trabalho e a equipe conversando, um clima de "chegada"/"entrada" que combina com
// a tela de login, em vez de repetir a sequência de EPI → campo → checklist da Recursos.
// Usa object-cover (não precisa da camada borrada de fundo do HeroVideoLoop): o painel de
// vídeo aqui já é preenchido por completo, sem letterboxing pra disfarçar.
const CLIPS = ["/login-showcase.mp4", "/login-access.mp4", "/login-teamwork.mp4"];

export function LoginVideoLoop() {
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLVideoElement | null>>([]);

  useEffect(() => {
    CLIPS.forEach((_, i) => {
      const video = refs.current[i];
      if (!video) return;
      if (i === active) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [active]);

  const handleEnded = () => setActive((i) => (i + 1) % CLIPS.length);

  return (
    <>
      {CLIPS.map((src, i) => (
        <video
          key={src}
          ref={(el) => {
            refs.current[i] = el;
          }}
          muted
          playsInline
          onEnded={handleEnded}
          className={`absolute inset-0 h-full w-full object-cover object-center pointer-events-none transition-opacity duration-1000 ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={src} type="video/mp4" />
        </video>
      ))}
    </>
  );
}
