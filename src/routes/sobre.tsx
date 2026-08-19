import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Target, Lightbulb, HeartHandshake, Eye } from "lucide-react";
import { MarketingHeader } from "@/components/safework/MarketingHeader";
import { MarketingFooter } from "@/components/safework/MarketingFooter";
import { MarketingCta } from "@/components/safework/MarketingCta";
import { Reveal } from "@/components/safework/Reveal";

export const Route = createFileRoute("/sobre")({
  head: () => ({ meta: [{ title: "Sobre nós — SafeWork" }] }),
  component: SobrePage,
});

const stats = [
  { value: "2019", label: "ano de fundação" },
  { value: "1.200+", label: "empresas atendidas" },
  { value: "2.400+", label: "colaboradores protegidos" },
  { value: "98%", label: "conformidade média dos clientes" },
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
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage: "radial-gradient(circle, rgb(15 23 42 / 0.07) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              maskImage: "radial-gradient(ellipse 55% 55% at 50% 0%, black 40%, transparent 100%)",
            }}
          />
        </div>

        <main className="mx-auto max-w-7xl px-6 pb-24 pt-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-slate-800">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Sobre a SafeWork
            </div>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl">
              Tecnologia para quem cuida de{" "}
              <span className="bg-gradient-to-r from-primary to-[oklch(0.65_0.15_205)] bg-clip-text text-transparent">
                quem trabalha.
              </span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
              Nascemos para acabar com a planilha de EPI perdida e o CA vencido descoberto tarde demais.
              Hoje ajudamos times de segurança do trabalho a provar conformidade em tempo real.
            </p>
          </Reveal>

          <section className="mt-16 grid gap-6 sm:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 90}>
                <div className="group rounded-2xl border border-slate-200/80 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
                  <p className="bg-gradient-to-r from-primary to-[oklch(0.65_0.15_205)] bg-clip-text text-3xl font-extrabold text-transparent">
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-500">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </section>

          <section className="mt-20 grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-primary/15 via-primary/5 to-transparent blur-2xl -z-10" />
              <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Target className="h-7 w-7" />
                </div>
                <h2 className="mt-4 text-xl font-bold text-slate-900">Nossa missão</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Tornar a gestão de segurança do trabalho tão simples quanto deveria sempre ter sido —
                  sem planilha, sem retrabalho, com prova de conformidade a um clique.
                </p>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
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

          <section className="mt-20">
            <Reveal className="text-center">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                O que guia nossas decisões.
              </h2>
            </Reveal>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map(({ icon: Icon, title, desc }, i) => (
                <Reveal key={title} delay={i * 90}>
                  <div className="group h-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10">
                    <div className="grid h-12 w-12 place-items-center rounded-full border border-primary/20 bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-base font-bold text-slate-900">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          <MarketingCta
            title="Quer levar a SafeWork para a sua operação?"
            description="Fale com o time e veja como a plataforma se encaixa no seu dia a dia."
            buttonLabel="Ver planos"
            buttonTo="/planos"
          />
        </main>
      </div>

      <MarketingFooter />
    </div>
  );
}
