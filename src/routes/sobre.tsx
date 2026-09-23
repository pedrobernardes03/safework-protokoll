import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingHeader } from "@/components/safework/MarketingHeader";
import { MarketingFooter } from "@/components/safework/MarketingFooter";
import { Reveal } from "@/components/safework/Reveal";
import { CountUp } from "@/components/safework/CountUp";
import { Mascot } from "@/components/safework/Mascot";
import { HowItWorksOverlay } from "@/components/safework/HowItWorksOverlay";

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
  const [activeValue, setActiveValue] = useState(0);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50 text-slate-800 font-sans">
      <MarketingHeader />

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-[460px]">
          <div className="absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2">
            <div className="absolute inset-0 animate-blob rounded-full bg-primary/10 blur-3xl" />
          </div>
        </div>

        <main className="mx-auto max-w-7xl px-6 pb-28 pt-8">
          {/* Sem o selo em maiúsculas que abre Início, Soluções e Planos — essa é a única
              página que começa direto pelo título, sem fórmula repetida. */}
          <Reveal className="max-w-3xl">
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-6xl">
              Segurança do trabalho,{" "}
              <span className="text-primary">levada a sério.</span>
            </h1>
          </Reveal>

          <Reveal delay={80}>
            <button
              type="button"
              onClick={() => setHowItWorksOpen(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-primary/25 bg-primary/5 px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
            >
              <PlayCircle className="h-5 w-5" />
              Ver como funciona
            </button>
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

          {/* Como começamos — a foto trocada por um momento crível de inspeção real (não
              duas pessoas paradas encarando a câmera com prancheta, que lia como banco de
              imagens genérico). O texto ganhou peso pra não sobrar vazio ao lado da foto:
              uma frase de abertura grande carrega a história, a de apoio só complementa. */}
          <section className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center">
            <div className="relative">
              <div className="absolute -bottom-4 left-6 right-6 h-8 rounded-full bg-slate-900/10 blur-xl" />
              <img
                src="/about-team.jpg"
                alt="Colaborador de capacete e colete de segurança inspecionando uma janela e anotando em uma prancheta"
                className="relative aspect-[4/5] w-full rounded-3xl object-cover object-[70%_25%] shadow-xl"
              />
            </div>

            <div className="border-l-4 border-primary/25 pl-6">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Como começamos
              </h2>
              <p className="mt-4 text-xl font-bold leading-snug tracking-tight text-slate-800 sm:text-2xl">
                Um acidente que um{" "}
                <span className="font-serif italic font-medium text-primary">alerta simples</span> teria
                evitado.
              </p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-500 sm:text-base">
                Foi esse o motivo para juntar entregas de EPI, certificados, ocorrências e a conversa entre
                gestor e colaborador em um só lugar, visível para os dois lados.
              </p>
            </div>
          </section>

          {/* Values — clicking a title swaps the statement on the right, like Soluções'
              module picker but light and editorial instead of a dark widget panel. Breaks
              from the static number+title+desc grid this section used before, which was
              structurally the same "four bordered items" shape as the homepage's claims
              list — this one is a single interactive component instead. */}
          <section className="mt-24">
            <h2 className="max-w-xl text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              O que guia nossas decisões.
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-[260px_1fr] lg:items-start">
              <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
                {values.map(({ title }, i) => (
                  <button
                    key={title}
                    type="button"
                    onClick={() => setActiveValue(i)}
                    className={`shrink-0 rounded-lg px-4 py-3 text-left text-sm font-semibold transition-colors lg:rounded-none lg:border-l-2 lg:px-4 lg:py-2.5 ${
                      i === activeValue
                        ? "bg-primary/5 text-primary lg:border-primary lg:bg-transparent"
                        : "border-transparent text-slate-400 hover:text-slate-600 lg:border-slate-200"
                    }`}
                  >
                    {title}
                  </button>
                ))}
              </div>

              <div key={activeValue} className="animate-in fade-in-0 slide-in-from-bottom-1 duration-300">
                <span className="font-serif text-4xl italic text-primary/25">
                  {String(activeValue + 1).padStart(2, "0")}
                </span>
                <p className="mt-3 max-w-xl text-xl font-medium leading-snug text-slate-800 sm:text-2xl">
                  {values[activeValue].desc}
                </p>
              </div>
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

      <HowItWorksOverlay open={howItWorksOpen} onClose={() => setHowItWorksOpen(false)} />
    </div>
  );
}
