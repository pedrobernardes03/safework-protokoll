import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Eye, Lightbulb, HeartHandshake, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingHeader } from "@/components/safework/MarketingHeader";
import { MarketingFooter } from "@/components/safework/MarketingFooter";
import { Reveal } from "@/components/safework/Reveal";
import { CountUp } from "@/components/safework/CountUp";

export const Route = createFileRoute("/sobre")({
  head: () => ({ meta: [{ title: "Sobre nós — SafeWork" }] }),
  component: SobrePage,
});

const stats = [
  { value: 2019, suffix: "", label: "ano de fundação" },
  { value: 1200, suffix: "+", label: "empresas atendidas" },
  { value: 2400, suffix: "+", label: "colaboradores protegidos" },
  { value: 98, suffix: "%", label: "conformidade média dos clientes" },
] as const;

const values = [
  {
    icon: ShieldCheck,
    title: "Segurança em primeiro lugar",
    desc: "Cada decisão de produto parte da mesma pergunta: isso protege quem trabalha no chão de fábrica?",
  },
  {
    icon: Eye,
    title: "Transparência",
    desc: "Gestores e colaboradores enxergam o mesmo histórico, sem informação escondida em planilhas soltas.",
  },
  {
    icon: Lightbulb,
    title: "Inovação constante",
    desc: "Evoluímos a plataforma com quem usa ela todos os dias: times de campo, RH e segurança do trabalho.",
  },
  {
    icon: HeartHandshake,
    title: "Foco no cliente",
    desc: "Sucesso para nós é a taxa de conformidade do seu time subindo mês após mês.",
  },
] as const;

function SobrePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50 text-slate-800 font-sans">
      <MarketingHeader />

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-[460px]">
          <div className="absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <main className="mx-auto max-w-7xl px-6 pb-28 pt-8">
          <Reveal className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">Sobre a SafeWork</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
              Tecnologia para quem cuida de{" "}
              <span className="font-serif italic font-medium text-primary">quem trabalha.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Nascemos para acabar com a planilha de EPI perdida e o CA vencido descoberto tarde demais.
              Hoje ajudamos times de segurança do trabalho a provar conformidade em tempo real.
            </p>
          </Reveal>

          {/* Stats — one divided strip instead of four identical gradient-number cards */}
          <Reveal delay={100} className="mt-14 grid grid-cols-2 gap-x-8 gap-y-8 border-y border-slate-200 py-8 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                  <CountUp value={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">{s.label}</p>
              </div>
            ))}
          </Reveal>

          <section className="mt-20 grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal className="relative">
              <div className="absolute -bottom-4 left-6 right-6 h-8 rounded-full bg-slate-900/10 blur-xl" />
              <img
                src="/about-team.jpg"
                alt="Gestora e colaborador em um canteiro de obras, ambos usando capacete e colete de segurança"
                className="relative aspect-[4/3] w-full rounded-3xl object-cover shadow-xl"
              />
            </Reveal>

            <Reveal delay={120}>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Nossa missão</p>
              <p className="mt-3 font-serif text-xl italic leading-snug text-slate-900 sm:text-2xl">
                "Tornar a gestão de segurança do trabalho tão simples quanto deveria sempre ter sido — sem
                planilha, sem retrabalho, com prova de conformidade a um clique."
              </p>

              <h2 className="mt-8 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                De uma dor real do chão de fábrica a uma plataforma completa.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                A SafeWork começou depois de ver, de perto, um acidente que poderia ter sido evitado com
                um simples alerta de CA vencido. A partir daí, construímos a plataforma que gostaríamos
                que aquela empresa tivesse tido: EPIs, certificados, ocorrências e comunicação em um só
                lugar, visível para quem decide e para quem executa.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                Hoje seguimos com o mesmo objetivo: cada colaborador chegando em casa no fim do dia,
                exatamente como saiu de manhã.
              </p>
            </Reveal>
          </section>

          {/* Values — a numbered editorial list instead of four identical icon cards */}
          <section className="mt-24">
            <Reveal className="max-w-xl">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                O que guia nossas decisões.
              </h2>
            </Reveal>

            <div className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2">
              {values.map(({ icon: Icon, title, desc }, i) => (
                <Reveal key={title} delay={i * 90} className="flex gap-5 border-t border-slate-200 pt-6">
                  <span className="font-serif text-3xl italic text-slate-300">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 text-primary" />
                      <h3 className="text-base font-bold text-slate-900">{title}</h3>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* Closing — a centered editorial statement with one real button, structurally
              different from the tag-recap (Home), single-line (Soluções), and reassurance
              (Planos) closings on the other marketing pages. */}
          <Reveal className="mt-28 flex flex-col items-center gap-6 text-center">
            <p className="max-w-lg font-serif text-2xl italic leading-snug text-slate-900 sm:text-3xl">
              Vamos proteger o seu time também?
            </p>
            <Button asChild size="lg" className="rounded-xl bg-primary px-7 py-6 text-base font-semibold text-primary-foreground hover:bg-primary/90">
              <Link to="/planos" className="flex items-center gap-2">
                Ver planos <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </Reveal>
        </main>
      </div>

      <MarketingFooter />
    </div>
  );
}
