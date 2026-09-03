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

      {/* Hero — o vídeo é o fundo de verdade da seção, não um card por cima da página. A
          sombra vive num wrapper SEM overflow-hidden (a sombra no mesmo elemento que
          recorta o conteúdo era cortada junto — por isso não aparecia antes). A seção é
          mais alta que a proporção nativa do vídeo (16:9), então object-contain (nunca
          corta) sobra uma faixa fora do quadro nítido. Em vez de tentar disfarçar essa
          faixa com uma vinheta sobre uma cor sólida — que ficava com uma emenda dura bem
          onde o vídeo real começa — o fundo da faixa é o PRÓPRIO vídeo, borrado e escuro,
          esticado por trás (mesma ideia do "now playing" de players de música/vídeo). Isso
          sozinho ainda deixava a emenda dura (o borrado é uma cor quase lisa, o vídeo
          nítido começa de repente em cima dela) — por isso o vídeo nítido também ganha uma
          máscara radial: as próprias bordas dele se dissolvem em transparência, então o
          fundo borrado aparece por baixo aos poucos em vez de a emenda ser uma linha só. */}
      <div className="relative shadow-[0_35px_60px_-20px_rgba(15,23,42,0.55)]">
        <section
          className="relative w-full overflow-hidden bg-slate-900"
          style={{ minHeight: "clamp(360px, 60vh, 680px)" }}
        >
          <video
            aria-hidden="true"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full scale-125 object-cover opacity-80 blur-3xl brightness-75"
          >
            <source src="/hero-safety.mp4" type="video/mp4" />
          </video>
          <div className="pointer-events-none absolute inset-0 bg-slate-900/35" />
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-contain"
            style={{
              maskImage: "radial-gradient(ellipse 75% 75% at 50% 50%, black 55%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 75% 75% at 50% 50%, black 55%, transparent 100%)",
            }}
          >
            <source src="/hero-safety.mp4" type="video/mp4" />
          </video>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
          <Reveal className="absolute inset-x-0 bottom-0 px-6 pb-10 sm:px-10 sm:pb-14 lg:px-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary sm:text-sm sm:tracking-[0.25em]">
              Gestão de EPIs
            </p>
            <h1 className="mt-2 max-w-lg text-2xl font-extrabold leading-[1.1] tracking-tight text-white sm:mt-3 sm:text-4xl lg:text-5xl">
              Cada EPI da sua equipe, com dono e{" "}
              <span className="font-serif italic font-medium text-primary">prova.</span>
            </h1>
          </Reveal>
        </section>
      </div>

      <main className="mx-auto max-w-7xl px-6 pb-24 pt-8">
        {/* Uma faixa de prova mais sóbria — sem linha de divisão logo depois do vídeo (o
            corte reto ficava esquisito), os números viram o elemento visual principal
            com o parágrafo como legenda, em vez de disputar peso um com o outro. */}
        <Reveal className="grid grid-cols-2 gap-8 sm:grid-cols-[auto_auto_1fr] sm:items-center sm:gap-12">
          <div>
            <p className="text-3xl font-extrabold text-slate-900 sm:text-4xl">-68%</p>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">tempo gasto em auditorias</p>
          </div>
          <div className="border-l border-slate-200 pl-8 sm:pl-12">
            <p className="text-3xl font-extrabold text-slate-900 sm:text-4xl">100%</p>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">rastreabilidade de EPIs</p>
          </div>
          <p className="col-span-2 text-sm leading-relaxed text-slate-500 sm:col-span-1 sm:border-l sm:border-slate-200 sm:pl-12 sm:text-base">
            Entrega, validade e troca de equipamento num histórico que responde por si —
            sem caçar planilha antes da fiscalização.
          </p>
        </Reveal>

        {/* 3D scroll-driven character showcase */}
        <div className="mt-20">
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
