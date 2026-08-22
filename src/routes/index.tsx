import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  HardHat,
  ArrowRight,
  User,
  Clock,
  Users,
  Factory,
  Building2,
  Box,
  Truck,
  Shield,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingHeader } from "@/components/safework/MarketingHeader";
import { MarketingFooter } from "@/components/safework/MarketingFooter";
import { MarketingCta } from "@/components/safework/MarketingCta";
import { Reveal } from "@/components/safework/Reveal";
import { CountUp } from "@/components/safework/CountUp";
import { Marquee } from "@/components/safework/Marquee";
import { CharacterShowcase } from "@/components/safework/three/CharacterShowcase";
import { useScrollParallax } from "@/lib/use-parallax";

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
  const { ref: mockupScrollRef, y: mockupY } = useScrollParallax(0.06);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50 text-slate-800 font-sans">
      <MarketingHeader />

      <main className="mx-auto max-w-7xl px-6 pb-24 pt-8">
        {/* Hero Section — overflow-hidden scoped locally so it never breaks position:sticky further down the page */}
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-[620px]">
            <div className="absolute left-1/2 top-0 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -left-24 top-40 h-72 w-72 rounded-full bg-[oklch(0.7_0.16_220)]/10 blur-3xl" />
            <div
              className="absolute inset-0 opacity-60"
              style={{
                backgroundImage: "radial-gradient(circle, rgb(15 23 42 / 0.07) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
                maskImage: "radial-gradient(ellipse 60% 55% at 50% 0%, black 40%, transparent 100%)",
              }}
            />
          </div>

          <section className="relative grid gap-12 lg:grid-cols-12 lg:items-center">

            {/* Left Column Content */}
            <Reveal className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-slate-800">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                Segurança do trabalho <span className="font-bold text-primary">conectada</span>
              </div>

              <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem]">
                Gestão inteligente de EPIs para equipes que valorizam{" "}
                <span className="bg-gradient-to-r from-primary to-[oklch(0.65_0.15_205)] bg-clip-text text-transparent">
                  segurança.
                </span>
              </h1>

              <p className="text-base text-slate-600 sm:text-lg leading-relaxed max-w-lg">
                Centralize o controle de Equipamentos de Proteção Individual, monitore Certificados de
                Aprovação e mantenha uma comunicação direta entre colaboradores e gestores.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  asChild
                  size="lg"
                  className="rounded-xl bg-primary text-primary-foreground font-semibold px-6 py-6 text-base shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
                >
                  <Link to="/login" className="flex items-center gap-2">
                    Acessar plataforma <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-xl border-primary/40 text-primary font-semibold px-6 py-6 text-base transition-all hover:-translate-y-0.5 hover:bg-primary/10"
                >
                  <Link to="/colaborador/meus-epis" className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" /> Área do colaborador
                  </Link>
                </Button>
              </div>
            </Reveal>

            {/* Right Column: a live-monitoring panel — deliberately not a browser-chrome
                screenshot (too common) or a floating stock photo (read as amateur). A dark
                glass panel with a real-time compliance ring and event feed ties directly
                into the "informação em tempo real" pitch instead of just showing a UI shell. */}
            <Reveal delay={150} className="lg:col-span-7 relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-primary/20 via-primary/5 to-transparent blur-2xl -z-10" />

              <div
                ref={mockupScrollRef}
                style={{ transform: `translateY(${mockupY}px)` }}
                className="animate-float relative overflow-hidden rounded-3xl bg-gradient-to-br from-[oklch(0.22_0.05_255)] via-[oklch(0.2_0.04_255)] to-[oklch(0.32_0.1_215)] p-6 shadow-2xl shadow-slate-900/40 sm:p-8"
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.06]"
                  style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "22px 22px" }}
                />
                <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/30 blur-3xl" />

                <div className="relative flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-white/60">
                    Monitoramento em tempo real
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </span>
                    Ao vivo
                  </span>
                </div>

                <div className="relative mt-6 flex items-center gap-6">
                  <svg width="104" height="104" viewBox="0 0 120 120" className="-rotate-90 shrink-0">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="white" strokeOpacity="0.12" strokeWidth="10" />
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="none"
                      stroke="oklch(0.77 0.17 165)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 52}
                      strokeDashoffset={2 * Math.PI * 52 * 0.02}
                    />
                  </svg>
                  <div>
                    <p className="text-4xl font-extrabold text-white">
                      <CountUp value={98} suffix="%" />
                    </p>
                    <p className="text-sm text-white/60">Conformidade da equipe agora</p>
                  </div>
                </div>

                <div className="relative mt-7 space-y-2">
                  {[
                    { icon: HardHat, text: "Capacete verificado — João Silva", time: "agora", tint: "bg-emerald-400" },
                    { icon: ShieldCheck, text: "CA atualizado — Óculos de proteção", time: "2 min atrás", tint: "bg-sky-400" },
                    { icon: Users, text: "Novo colaborador cadastrado — Ana Costa", time: "5 min atrás", tint: "bg-sky-400" },
                    { icon: ClipboardList, text: "Luva de proteção vence em 3 dias", time: "8 min atrás", tint: "bg-amber-400" },
                  ].map((event) => (
                    <div
                      key={event.text}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 backdrop-blur-sm"
                    >
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${event.tint}`} />
                      <event.icon className="h-4 w-4 shrink-0 text-white/50" />
                      <p className="flex-1 truncate text-xs font-medium text-white/90">{event.text}</p>
                      <span className="shrink-0 text-[11px] text-white/40">{event.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </section>
        </div>

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
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
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

        <MarketingCta
          title="Sua equipe merece um EPI que nunca vence sem aviso."
          description="Comece agora e veja a conformidade da sua operação em tempo real."
          buttonLabel="Acessar plataforma"
          buttonTo="/login"
        />
      </main>

      <MarketingFooter />
    </div>
  );
}
