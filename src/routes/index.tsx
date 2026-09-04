import { createFileRoute } from "@tanstack/react-router";
import {
  ShieldCheck,
  Clock,
  Users,
  Factory,
  Building2,
  Box,
  Truck,
  Shield,
} from "lucide-react";
import { MarketingHeader } from "@/components/safework/MarketingHeader";
import { MarketingFooter } from "@/components/safework/MarketingFooter";
import { Reveal } from "@/components/safework/Reveal";
import { CountUp } from "@/components/safework/CountUp";
import { Marquee } from "@/components/safework/Marquee";
import { CharacterShowcase } from "@/components/safework/three/CharacterShowcase";

export const Route = createFileRoute("/")({
  component: Landing,
});

const trustLogos = [
  { icon: Building2, label: "Construtec", tracking: "tracking-wider" },
  { icon: Factory, label: "INDÚSTRIA FORTE", tracking: "tracking-wide" },
  { icon: Box, label: "ENGEPRO", tracking: "tracking-widest" },
  { icon: Truck, label: "LogSolution", tracking: "tracking-tight" },
  { icon: Shield, label: "MAIS SAFETY", tracking: "tracking-wider" },
] as const;

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50 text-slate-800 font-sans">
      <MarketingHeader />

      {/* Hero — preenche a tela inteira na abertura do site. A seção usa min-height:
          calc(100vh - altura do header), não só 100vh puro: como o texto fica ancorado no
          rodapé da própria seção, colocar 100vh cheio (ignorando o header sticky que fica
          ACIMA dela) empurrava esse texto pra pouco abaixo da dobra — dava pra ver só o
          vídeo, mas não o título. Descontando a altura do header (fixa o bastante entre os
          dois breakpoints pra usar um valor só), header + seção somam exatamente uma tela,
          e o título aparece por inteiro sem rolar. Tentei antes um flex-1 pro header
          "dividir" a tela com a seção, mas isso não funciona quando há muito conteúdo
          depois: o flex-grow só distribui espaço que sobra dentro da altura do próprio
          container, e como o resto da página já passa de 100vh, não sobrava espaço — a
          seção caía pro seu tamanho mínimo em vez de preencher a tela. Um min-height fixo
          na própria seção não depende de nada do que vem depois. O vídeo é o fundo de
          verdade da seção, não um card por cima da página. A sombra vive num wrapper SEM
          overflow-hidden (a sombra no mesmo elemento que recorta o conteúdo era cortada
          junto — por isso não aparecia antes). Como a seção é mais alta que a proporção
          nativa do vídeo (16:9), object-contain (nunca corta) sobra uma faixa fora do
          quadro nítido. Em vez de tentar disfarçar essa faixa com uma vinheta sobre uma cor
          sólida — que ficava com uma emenda dura bem onde o vídeo real começa — o fundo da
          faixa é o PRÓPRIO vídeo, na mesma posição (object-contain igual ao vídeo nítido,
          não object-cover), só que borrado. Por usar exatamente o mesmo enquadramento, o
          desfoque (que naturalmente espalha cor e transparência para além da borda
          original do elemento) esfuma sozinho a transição — sem precisar calcular onde a
          faixa começa em cada tamanho de tela, o que uma vinheta ou máscara fixa em
          porcentagem não conseguia acertar nos dois formatos (retrato no celular, paisagem
          no desktop) ao mesmo tempo. */}
      <div className="relative shadow-[0_35px_60px_-20px_rgba(15,23,42,0.55)]">
        <section className="relative min-h-[calc(100vh-4.5rem)] w-full overflow-hidden bg-slate-900">
          <video
            aria-hidden="true"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full scale-110 object-contain opacity-90 blur-3xl brightness-75"
          >
            <source src="/hero-safety.mp4" type="video/mp4" />
          </video>
          <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-contain">
            <source src="/hero-safety.mp4" type="video/mp4" />
          </video>
          {/* A faixa de baixo precisa ficar legível em qualquer frame do vídeo (ele roda em
              loop, o enquadramento muda) — um gradiente suave sozinho não garante isso
              quando a cena atrás do texto clareia. Por isso a faixa embaixo fica bem mais
              opaca (quase sólida nos últimos ~40% da altura) e o texto ainda ganha uma
              sombra própria, redundante de propósito: não depende de adivinhar o brilho
              médio do vídeo. */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/55 to-transparent" />
          <Reveal className="absolute inset-x-0 bottom-0 px-6 pb-10 sm:px-10 sm:pb-14 lg:px-16">
            {/* O verde padrão do site (--primary) é escuro de propósito — pensado pra ler
                sobre fundo claro. Em cima do vídeo escuro ele quase some, ainda mais com o
                brilho variando quadro a quadro. Aqui usa-se o MESMO verde da marca, só que
                na tonalidade clara que o tema escuro do sistema já define — feita
                justamente pra contrastar contra fundo escuro. */}
            <p
              className="text-xs font-bold uppercase tracking-[0.2em] drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)] sm:text-sm sm:tracking-[0.25em]"
              style={{ color: "oklch(0.75 0.15 150)" }}
            >
              Gestão de EPIs
            </p>
            <h1 className="mt-2 max-w-lg text-2xl font-extrabold leading-[1.1] tracking-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.55)] sm:mt-3 sm:text-4xl lg:text-5xl">
              Cada EPI da sua equipe, com dono e{" "}
              <span className="font-serif italic font-medium" style={{ color: "oklch(0.75 0.15 150)" }}>
                prova.
              </span>
            </h1>
          </Reveal>
        </section>
      </div>

      {/* Faixa de transição — sem ela, o navy do vídeo batia direto na área clara da página,
          uma quebra seca. Começa na mesma cor sólida da seção (slate-900) e derrete pra
          transparente, revelando o fundo da própria página por trás em vez de saltar de
          uma cor pra outra de repente. */}
      <div
        className="pointer-events-none h-14 w-full sm:h-20"
        style={{ background: "linear-gradient(to bottom, #0f172a, transparent)" }}
      />

      <main className="mx-auto max-w-7xl px-6 pb-24 pt-2 sm:pt-0">
        {/* 3D scroll-driven character showcase */}
        <div className="mt-16 sm:mt-20">
          <Reveal className="mx-auto max-w-2xl text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-slate-800">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Como funciona
            </div>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Segurança visível em cada etapa do turno.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base lg:hidden">
              Do primeiro checklist do dia ao relatório mensal de conformidade, a SafeWork acompanha
              cada EPI, cada certificado e cada colaborador em tempo real.
            </p>
            <p className="mt-3 hidden text-sm leading-relaxed text-slate-500 sm:text-base lg:block">
              Role a página — a câmera foca em cada EPI conforme o sistema mostra o que faz por ele.
            </p>
          </Reveal>

          <CharacterShowcase />
        </div>

        {/* Feature Highlights Row Container (4 Pillars) */}
        <section className="mt-20 rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            {[
              {
                icon: ShieldCheck,
                title: "Tudo em um só lugar",
                desc: "EPIs, CAs e comunicação centralizados.",
              },
              {
                icon: Clock,
                title: "Tempo é segurança",
                desc: "Reduza retrabalho e ganhe agilidade.",
              },
              {
                icon: ShieldCheck,
                title: "Conformidade garantida",
                desc: "Auditorias e documentos sempre em dia.",
              },
              {
                icon: Users,
                title: "Equipes conectadas",
                desc: "Mais transparência entre colaboradores e gestores.",
              },
            ].map((item, i) => (
              <Reveal
                key={item.title}
                delay={i * 100}
                className="group flex items-start gap-4 pt-4 sm:pt-0 sm:px-5 first:pl-0"
              >
                <div className="grid h-10 w-12 shrink-0 place-items-center rounded-full border border-primary/20 bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Client Trust Section */}
        <Reveal className="mt-20 space-y-8 text-center">
          <p className="text-sm font-semibold text-slate-600">
            Mais de{" "}
            <span className="font-bold text-primary">
              <CountUp value={1200} suffix="+" />
            </span>{" "}
            empresas já confiam
          </p>

          <Marquee className="opacity-75 grayscale transition-all hover:grayscale-0">
            {trustLogos.map(({ icon: Icon, label, tracking }) => (
              <div
                key={label}
                className={`flex shrink-0 items-center gap-2 text-lg font-bold text-slate-700 ${tracking}`}
              >
                <Icon className="h-6 w-6 text-slate-500" />
                <span>{label}</span>
              </div>
            ))}
          </Marquee>
        </Reveal>
      </main>

      <MarketingFooter />
    </div>
  );
}
