import { useEffect, useRef, useState } from "react";

// Três cenas em sequência com crossfade, contando uma história com sentido em vez de só
// alternar clipes aleatórios: equipar o EPI → estar em campo com ele, já registrado (CA à
// mão) → conferir/assinar o checklist. Cada vídeo toca até o fim natural (sem `loop`, pra
// o evento `ended` disparar) e aí avança pro próximo, voltando ao primeiro depois do
// terceiro — um ciclo contínuo.
const CLIPS = ["/hero-safety.mp4", "/hero-onsite.mp4", "/hero-checklist.mp4"];

export function HeroVideoLoop() {
  const [active, setActive] = useState(0);
  const sharpRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const blurRefs = useRef<Array<HTMLVideoElement | null>>([]);

  useEffect(() => {
    CLIPS.forEach((_, i) => {
      const sharp = sharpRefs.current[i];
      const blur = blurRefs.current[i];
      if (i === active) {
        if (sharp) {
          sharp.currentTime = 0;
          sharp.play().catch(() => {});
        }
        if (blur) {
          blur.currentTime = 0;
          blur.play().catch(() => {});
        }
      } else {
        sharp?.pause();
        blur?.pause();
      }
    });
  }, [active]);

  const handleEnded = () => setActive((i) => (i + 1) % CLIPS.length);

  return (
    <>
      {CLIPS.map((src, i) => (
        <video
          key={`blur-${src}`}
          ref={(el) => {
            blurRefs.current[i] = el;
          }}
          aria-hidden="true"
          muted
          playsInline
          className={`absolute inset-0 h-full w-full scale-110 object-contain opacity-90 blur-3xl brightness-75 transition-opacity duration-1000 ${
            i === active ? "opacity-90" : "opacity-0"
          }`}
        >
          <source src={src} type="video/mp4" />
        </video>
      ))}
      {CLIPS.map((src, i) => (
        <video
          key={`sharp-${src}`}
          ref={(el) => {
            sharpRefs.current[i] = el;
          }}
          muted
          playsInline
          onEnded={handleEnded}
          className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-1000 ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={src} type="video/mp4" />
        </video>
      ))}
    </>
  );
}
