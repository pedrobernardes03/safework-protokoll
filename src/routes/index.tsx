import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  HardHat,
  ClipboardList,
  BarChart3,
  ArrowRight,
  User,
  Clock,
  Users,
  Bell,
  Home,
  Settings,
  LogOut,
  Factory,
  Building2,
  Box,
  Truck,
  Shield,
  Glasses,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingHeader } from "@/components/safework/MarketingHeader";
import { MarketingFooter } from "@/components/safework/MarketingFooter";
import { MarketingCta } from "@/components/safework/MarketingCta";
import { Reveal } from "@/components/safework/Reveal";
import { CountUp } from "@/components/safework/CountUp";
import { Marquee } from "@/components/safework/Marquee";
import { SafetyWorkerIllustration } from "@/components/safework/SafetyWorkerIllustration";
import { useMouseParallax, useScrollParallax } from "@/lib/use-parallax";

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

const workflowFeatures = [
  {
    icon: HardHat,
    title: "Checklist diário em segundos",
    desc: "Colaborador confirma o uso de cada EPI direto do celular, sem planilha.",
  },
  {
    icon: BadgeCheck,
    title: "CAs sempre em dia",
    desc: "Alertas automáticos antes do vencimento de cada Certificado de Aprovação.",
  },
  {
    icon: ShieldCheck,
    title: "Conformidade em tempo real",
    desc: "Indicadores por setor e por colaborador, atualizados a cada confirmação.",
  },
] as const;

function Landing() {
  const { ref: heroParallaxRef, offset: heroOffset } = useMouseParallax(16);
  const { ref: mockupScrollRef, y: mockupY } = useScrollParallax(0.06);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50 text-slate-800 font-sans">
      <MarketingHeader />

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

        {/* Hero Section */}
        <main className="mx-auto max-w-7xl px-6 pb-24 pt-8">
          <section ref={heroParallaxRef} className="relative grid gap-12 lg:grid-cols-12 lg:items-center">
            <div
              className="pointer-events-none absolute -top-10 left-[6%] hidden items-center gap-1.5 rounded-xl border border-primary/20 bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg backdrop-blur-sm lg:flex"
              style={{ transform: `translate(${heroOffset.x * -1}px, ${heroOffset.y * -1}px)` }}
            >
              <HardHat className="h-4 w-4 text-primary" /> Capacete verificado
            </div>
            <div
              className="pointer-events-none absolute -top-10 right-[8%] hidden items-center gap-1.5 rounded-xl border border-primary/20 bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg backdrop-blur-sm lg:flex"
              style={{ transform: `translate(${heroOffset.x * 1.3}px, ${heroOffset.y * 1.3}px)` }}
            >
              <Glasses className="h-4 w-4 text-primary" /> Óculos em dia
            </div>

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

            {/* Right Column: Platform Preview Mockup Graphic */}
            <Reveal delay={150} className="lg:col-span-7 relative">
              {/* Background Glow */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-primary/15 via-primary/5 to-transparent blur-2xl -z-10" />

              <div ref={mockupScrollRef} style={{ transform: `translateY(${mockupY}px)` }}>
              {/* Main Window Card */}
              <div className="animate-float rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-md p-3 sm:p-4 shadow-2xl shadow-slate-900/10 flex gap-3">
              {/* Mini Left Sidebar */}
              <div className="hidden sm:flex flex-col items-center justify-between py-3 px-2 border-r border-slate-100 bg-slate-50/60 rounded-2xl w-14 shrink-0">
                <div className="space-y-4 flex flex-col items-center">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 grid place-items-center text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="space-y-3 pt-2">
                    <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground grid place-items-center shadow-sm">
                      <Home className="h-4 w-4" />
                    </div>
                    <div className="h-9 w-9 rounded-xl text-slate-400 hover:text-slate-600 grid place-items-center">
                      <ClipboardList className="h-4 w-4" />
                    </div>
                    <div className="h-9 w-9 rounded-xl text-slate-400 hover:text-slate-600 grid place-items-center">
                      <BarChart3 className="h-4 w-4" />
                    </div>
                    <div className="h-9 w-9 rounded-xl text-slate-400 hover:text-slate-600 grid place-items-center">
                      <Shield className="h-4 w-4" />
                    </div>
                    <div className="h-9 w-9 rounded-xl text-slate-400 hover:text-slate-600 grid place-items-center">
                      <Users className="h-4 w-4" />
                    </div>
                    <div className="h-9 w-9 rounded-xl text-slate-400 hover:text-slate-600 grid place-items-center">
                      <Settings className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <div className="h-9 w-9 rounded-xl text-slate-400 grid place-items-center">
                  <LogOut className="h-4 w-4" />
                </div>
              </div>

              {/* Mockup Main View */}
              <div className="flex-1 space-y-4 p-2 sm:p-3">
                {/* Mockup Top Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">Painel do gestor</h3>
                  <div className="flex items-center gap-3">
                    <div className="relative text-slate-500">
                      <Bell className="h-4 w-4" />
                      <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <div className="h-8 w-8 rounded-full bg-slate-200 grid place-items-center text-xs font-semibold text-slate-700">
                      JS
                    </div>
                  </div>
                </div>

                {/* Top Stats Grid (4 Metrics) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                  <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 grid place-items-center">
                        <HardHat className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-slate-700">Meus EPIs</p>
                        <p className="text-lg font-extrabold text-slate-900 leading-tight">
                          <CountUp value={12} />
                        </p>
                        <p className="text-[10px] text-slate-400">Itens ativos</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 grid place-items-center">
                        <ClipboardList className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-slate-700">Observações</p>
                        <p className="text-lg font-extrabold text-slate-900 leading-tight">
                          <CountUp value={3} />
                        </p>
                        <p className="text-[10px] text-slate-400">Pendências</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-emerald-50 text-primary grid place-items-center">
                        <BarChart3 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-slate-700">CAs monitorados</p>
                        <p className="text-lg font-extrabold text-slate-900 leading-tight">
                          <CountUp value={28} />
                        </p>
                        <p className="text-[10px] text-slate-400">Próximos do vencimento</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-cyan-50 text-cyan-600 grid place-items-center">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-slate-700">Conformidade</p>
                        <p className="text-lg font-extrabold text-slate-900 leading-tight">
                          <CountUp value={98} suffix="%" />
                        </p>
                        <p className="text-[10px] text-slate-400">Média da equipe</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom 2 Grid Cards */}
                <div className="grid sm:grid-cols-2 gap-3 pt-1">
                  {/* Card 1: Próximos vencimentos */}
                  <div className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm space-y-3">
                    <h4 className="text-xs font-bold text-slate-900">Próximos vencimentos</h4>
                    <div className="space-y-2.5 text-xs">
                      <div>
                        <div className="flex justify-between font-semibold text-slate-800 text-[11px]">
                          <span>Capacete de segurança</span>
                          <span className="text-slate-500 font-normal">12 dias</span>
                        </div>
                        <p className="text-[10px] text-slate-400">CA 12345</p>
                        <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-primary rounded-full w-3/4" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold text-slate-800 text-[11px]">
                          <span>Óculos de proteção</span>
                          <span className="text-slate-500 font-normal">18 dias</span>
                        </div>
                        <p className="text-[10px] text-slate-400">CA 54321</p>
                        <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-primary rounded-full w-1/2" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold text-slate-800 text-[11px]">
                          <span>Luva de proteção</span>
                          <span className="text-slate-500 font-normal">25 dias</span>
                        </div>
                        <p className="text-[10px] text-slate-400">CA 67890</p>
                        <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-primary rounded-full w-1/3" />
                        </div>
                      </div>
                    </div>
                    <button className="text-[11px] font-semibold text-primary hover:underline">Ver todos</button>
                  </div>

                  {/* Card 2: Comunicação recente */}
                  <div className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm space-y-3">
                    <h4 className="text-xs font-bold text-slate-900">Comunicação recente</h4>
                    <div className="space-y-3 text-xs">
                      <div className="flex items-start gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-slate-100 grid place-items-center text-slate-600 shrink-0 mt-0.5">
                          <User className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-[11px]">Novo comunicado de segurança</p>
                          <p className="text-[10px] text-slate-400">Hoje, 08:30</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-slate-100 grid place-items-center text-slate-600 shrink-0 mt-0.5">
                          <User className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-[11px]">Atualização de CA</p>
                          <p className="text-[10px] text-slate-400">Ontem, 16:45</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-slate-100 grid place-items-center text-slate-600 shrink-0 mt-0.5">
                          <User className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-[11px]">Treinamento agendado</p>
                          <p className="text-[10px] text-slate-400">21/05/2024</p>
                        </div>
                      </div>
                    </div>
                    <button className="text-[11px] font-semibold text-primary hover:underline">Ver todas</button>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </Reveal>
        </section>

        {/* Illustrated workflow section */}
        <Reveal className="mt-20 grid gap-12 rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm sm:p-10 lg:grid-cols-2 lg:items-center">
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-8 -z-10 rounded-full bg-primary/10 blur-3xl" />
            <SafetyWorkerIllustration className="w-full" />
            <div className="absolute -left-4 top-10 hidden items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg animate-float sm:flex">
              <ShieldCheck className="h-4 w-4 text-primary" /> CA em dia
            </div>
            <div
              className="absolute -right-2 bottom-16 hidden items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg animate-float sm:flex"
              style={{ animationDelay: "1.1s" }}
            >
              <Bell className="h-4 w-4 text-primary" /> Alerta enviado
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-slate-800">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Como funciona
            </div>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Segurança visível em cada etapa do turno.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base">
              Do primeiro checklist do dia ao relatório mensal de conformidade, a SafeWork acompanha
              cada EPI, cada certificado e cada colaborador em tempo real.
            </p>

            <ul className="mt-8 space-y-5">
              {workflowFeatures.map(({ icon: Icon, title, desc }, i) => (
                <Reveal key={title} delay={i * 100}>
                  <li className="group flex items-start gap-4">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-primary/20 bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-500">{desc}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </Reveal>

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
                className="group flex items-start gap-4 pt-4 sm:pt-0 sm:px-4 first:pl-0"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-primary/20 bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
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
    </div>
  );
}
