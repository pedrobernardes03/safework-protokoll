import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
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
    title: "Segurança em primeiro lugar",
    desc: "Toda funcionalidade nova passa pela mesma pergunta: isso reduz o risco de alguém se machucar?",
  },
  {
    title: "Transparência",
    desc: "Gestor e colaborador enxergam o mesmo histórico — nada fica só na cabeça de uma pessoa.",
  },
  {
    title: "Inovação constante",
    desc: "Quem usa o produto todo dia — RH, campo, segurança do trabalho — é quem molda o que vem a seguir.",
  },
  {
    title: "Foco no cliente",
    desc: "Medimos sucesso pela taxa de conformidade do seu time, não pela nossa.",
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
          {/* Sem o selo em maiúsculas que abre Início, Soluções e Planos — essa é a única
              página que começa direto pelo título, sem fórmula repetida. */}
          <Reveal className="max-w-3xl">
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-6xl">
              Segurança do trabalho,{" "}
              <span className="font-serif italic font-medium text-primary">levada a sério.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Existimos desde 2019. Hoje mais de 1.200 empresas usam a SafeWork pra saber, todo dia,
              se cada pessoa está com o equipamento certo.
            </p>
          </Reveal>

          {/* Stats — one divided strip instead of four identical gradient-number cards.
              No entrance animation from here down: the hero above is this page's one
              orchestrated reveal, everything else just appears in place. */}
          <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-8 border-y border-slate-200 py-8 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                  <CountUp value={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">{s.label}</p>
              </div>
            ))}
          </div>

          <section className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div className="relative">
              <div className="absolute -bottom-4 left-6 right-6 h-8 rounded-full bg-slate-900/10 blur-xl" />
              <img
                src="/about-team.jpg"
                alt="Gestora e colaborador em um canteiro de obras, ambos usando capacete e colete de segurança"
                className="relative aspect-[4/3] w-full rounded-3xl object-cover shadow-xl"
              />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Como começamos
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                Um acidente que um alerta simples teria evitado — foi esse o motivo pra juntar entregas de
                EPI, certificados, ocorrências e conversa entre gestor e colaborador num lugar só, visível
                pros dois lados.
              </p>
            </div>
          </section>

          {/* Values — a numbered editorial list instead of four identical icon cards.
              The number already carries the "this is item N of 4" signal, so no icon
              rides along next to the title — it was decoration standing in for a job the
              title text and copy already do on their own. */}
          <section className="mt-24">
            <h2 className="max-w-xl text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              O que guia nossas decisões.
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2">
              {values.map(({ title, desc }, i) => (
                <div key={title} className="flex gap-5 border-t border-slate-200 pt-6">
                  <span className="font-serif text-3xl italic text-slate-300">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Closing — direto, sem o itálico serifado que a foto/H1 já usam em outras
              páginas; estruturalmente diferente do recap (Início), linha única (Soluções)
              e reforço de garantia (Planos). */}
          <div className="mt-28 flex flex-col items-center gap-6 text-center">
            <p className="max-w-md text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Quer ver a SafeWork rodando com o seu time?
            </p>
            <Button asChild size="lg" className="rounded-xl bg-primary px-7 py-6 text-base font-semibold text-primary-foreground hover:bg-primary/90">
              <Link to="/planos" className="flex items-center gap-2">
                Ver planos <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </main>
      </div>

      <MarketingFooter />
    </div>
  );
}
