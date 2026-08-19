import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MarketingHeader } from "@/components/safework/MarketingHeader";
import { MarketingFooter } from "@/components/safework/MarketingFooter";
import { MarketingCta } from "@/components/safework/MarketingCta";
import { Reveal } from "@/components/safework/Reveal";

export const Route = createFileRoute("/planos")({
  head: () => ({ meta: [{ title: "Planos — SafeWork" }] }),
  component: PlanosPage,
});

const plans = [
  {
    name: "Starter",
    desc: "Para times pequenos começando a organizar EPIs.",
    monthly: 29,
    annual: 24,
    highlight: false,
    cta: "Começar agora",
    features: [
      "Até 30 colaboradores",
      "Controle de EPIs e entregas",
      "Alertas de vencimento de CA",
      "1 unidade / filial",
      "Suporte por e-mail",
    ],
  },
  {
    name: "Business",
    desc: "Para operações que precisam de conformidade e times conectados.",
    monthly: 79,
    annual: 65,
    highlight: true,
    cta: "Escolher Business",
    features: [
      "Colaboradores ilimitados",
      "Tudo do Starter",
      "Observações e ocorrências",
      "Relatórios e analytics",
      "Chat colaborador ↔ gestor",
      "Até 5 unidades / filiais",
      "Suporte prioritário",
    ],
  },
  {
    name: "Enterprise",
    desc: "Para operações multiempresa com integrações e SLA dedicado.",
    monthly: null,
    annual: null,
    highlight: false,
    cta: "Falar com vendas",
    features: [
      "Tudo do Business",
      "Multiempresa e multi-idioma",
      "Integrações (ERP, RH, API)",
      "Login corporativo (SSO)",
      "Auditoria e logs completos",
      "Gerente de conta dedicado",
    ],
  },
] as const;

const faqs = [
  {
    q: "Posso trocar de plano depois?",
    a: "Sim. Você pode fazer upgrade ou downgrade a qualquer momento, com ajuste proporcional na cobrança.",
  },
  {
    q: "Existe período de teste gratuito?",
    a: "Sim, todos os planos incluem 14 dias grátis, sem necessidade de cartão de crédito.",
  },
  {
    q: "Como funciona a cobrança por colaborador?",
    a: "O valor é calculado com base no número de colaboradores ativos na plataforma no mês.",
  },
  {
    q: "O plano Enterprise tem valor fixo?",
    a: "Não. O valor é definido conforme volume, integrações necessárias e SLA contratado.",
  },
] as const;

function PlanosPage() {
  const [annual, setAnnual] = useState(true);

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
              Planos SafeWork
            </div>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl">
              Um plano para cada{" "}
              <span className="bg-gradient-to-r from-primary to-[oklch(0.65_0.15_205)] bg-clip-text text-transparent">
                tamanho de operação.
              </span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
              Comece pequeno e cresça sem trocar de plataforma. Cancele quando quiser.
            </p>

            <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white p-1.5 text-sm font-semibold shadow-sm">
              <button
                type="button"
                onClick={() => setAnnual(false)}
                className={`rounded-full px-4 py-2 transition-colors ${!annual ? "bg-primary text-primary-foreground shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
              >
                Mensal
              </button>
              <button
                type="button"
                onClick={() => setAnnual(true)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 transition-colors ${annual ? "bg-primary text-primary-foreground shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
              >
                Anual
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${annual ? "bg-primary-foreground/20" : "bg-primary/10 text-primary"}`}
                >
                  -18%
                </span>
              </button>
            </div>
          </Reveal>

          <section className="mt-14 grid gap-6 lg:grid-cols-3 lg:items-start">
            {plans.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 100} className="h-full">
                <div
                  className={`relative flex h-full flex-col rounded-3xl border p-8 transition-all duration-300 hover:-translate-y-1 ${
                    plan.highlight
                      ? "border-primary/60 bg-white shadow-2xl shadow-primary/15 lg:-translate-y-3 lg:hover:-translate-y-4"
                      : "border-slate-200/80 bg-white shadow-sm hover:shadow-lg"
                  }`}
                >
                  {plan.highlight && (
                    <>
                      <div className="pointer-events-none absolute -inset-px -z-10 rounded-3xl bg-gradient-to-br from-primary/40 via-primary/10 to-transparent blur-md" />
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-[oklch(0.65_0.15_205)] px-4 py-1 text-xs font-bold text-primary-foreground shadow-md">
                        Mais popular
                      </span>
                    </>
                  )}

                  <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{plan.desc}</p>

                  <div className="mt-6">
                    {plan.monthly === null ? (
                      <p className="text-3xl font-extrabold text-slate-900">Sob consulta</p>
                    ) : (
                      <p className="flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold text-slate-900">
                          R$ {annual ? plan.annual : plan.monthly}
                        </span>
                        <span className="text-sm font-medium text-slate-500">/colaborador/mês</span>
                      </p>
                    )}
                  </div>

                  <Button
                    asChild
                    size="lg"
                    className={`mt-6 rounded-xl py-6 text-base font-semibold transition-all hover:-translate-y-0.5 ${
                      plan.highlight
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
                        : "border border-primary/40 bg-white text-primary hover:bg-primary/10"
                    }`}
                    variant={plan.highlight ? "default" : "outline"}
                  >
                    <Link to="/login">{plan.cta}</Link>
                  </Button>

                  <ul className="mt-8 space-y-3 text-sm text-slate-600">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </section>

          <Reveal className="mt-24 mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Perguntas frequentes
            </h2>
            <Accordion
              type="single"
              collapsible
              className="mt-10 rounded-2xl border border-slate-200/80 bg-white px-6 shadow-sm"
            >
              {faqs.map((item) => (
                <AccordionItem key={item.q} value={item.q} className="border-slate-100">
                  <AccordionTrigger className="text-sm font-semibold text-slate-900 hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-slate-500">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>

          <MarketingCta
            title="Ainda com dúvidas sobre qual plano escolher?"
            description="Nosso time ajuda a encontrar o melhor plano para o tamanho da sua operação."
            buttonLabel="Falar com o time"
            buttonTo="/sobre"
          />
        </main>
      </div>

      <MarketingFooter />
    </div>
  );
}
