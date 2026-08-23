import { Fragment } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ArrowRight, Minus, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MarketingHeader } from "@/components/safework/MarketingHeader";
import { MarketingFooter } from "@/components/safework/MarketingFooter";
import { Reveal } from "@/components/safework/Reveal";

export const Route = createFileRoute("/planos")({
  head: () => ({ meta: [{ title: "Planos — SafeWork" }] }),
  component: PlanosPage,
});

const plans = [
  {
    name: "Starter",
    desc: "Times pequenos organizando EPIs.",
    monthly: 29,
    annual: 24,
    highlight: false,
    cta: "Começar agora",
  },
  {
    name: "Business",
    desc: "Conformidade e times conectados.",
    monthly: 79,
    annual: 65,
    highlight: true,
    cta: "Escolher Business",
  },
  {
    name: "Enterprise",
    desc: "Multiempresa, integrações e SLA.",
    monthly: null,
    annual: null,
    highlight: false,
    cta: "Falar com vendas",
  },
] as const;

// A single feature-comparison table instead of three near-identical cards — reads as a
// serious enterprise pricing page rather than the generic "3 cards + toggle" template,
// and lets each row make an explicit, scannable claim per plan instead of a bulleted
// list where absence of a feature is just... not mentioned.
const featureGroups = [
  {
    title: "Equipe",
    rows: [
      { label: "Colaboradores", values: ["Até 30", "Ilimitados", "Ilimitados"], essential: true },
      { label: "Unidades / filiais", values: ["1", "Até 5", "Ilimitadas"], essential: false },
    ],
  },
  {
    title: "Gestão de EPIs",
    rows: [
      { label: "Entrega, troca e devolução", values: [true, true, true], essential: false },
      { label: "Alertas de vencimento de CA", values: [true, true, true], essential: false },
      { label: "Observações e ocorrências", values: [false, true, true], essential: true },
    ],
  },
  {
    title: "Colaboração & dados",
    rows: [
      { label: "Chat colaborador ↔ gestor", values: [false, true, true], essential: false },
      { label: "Relatórios e analytics", values: [false, true, true], essential: true },
      { label: "Multiempresa e multi-idioma", values: [false, false, true], essential: false },
    ],
  },
  {
    title: "Segurança & integrações",
    rows: [
      { label: "Login corporativo (SSO)", values: [false, false, true], essential: false },
      { label: "Integrações (ERP, RH, API)", values: [false, false, true], essential: true },
      { label: "Auditoria e logs completos", values: [false, false, true], essential: false },
    ],
  },
  {
    title: "Suporte",
    rows: [{ label: "Canal de suporte", values: ["E-mail", "Prioritário", "Gerente dedicado"], essential: true }],
  },
] as const;

const essentialRows = featureGroups.flatMap((group) => group.rows.filter((row) => row.essential));

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
  const [expanded, setExpanded] = useState(false);

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
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">Planos SafeWork</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
              Um plano para cada{" "}
              <span className="font-serif italic font-medium text-primary">tamanho de operação.</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
              Comece pequeno e cresça sem trocar de plataforma. Cancele quando quiser.
            </p>

            <div className="relative mt-8 inline-grid grid-cols-2 items-center rounded-full border border-slate-200 bg-white p-1.5 text-sm font-semibold shadow-sm">
              <div
                className="absolute inset-y-1.5 left-1.5 w-[calc(50%-0.1875rem)] rounded-full bg-primary shadow-sm transition-transform duration-300 ease-out"
                style={{ transform: annual ? "translateX(100%)" : "translateX(0)" }}
              />
              <button
                type="button"
                onClick={() => setAnnual(false)}
                className={`relative z-10 rounded-full px-5 py-2 transition-colors duration-300 ${!annual ? "text-primary-foreground" : "text-slate-500 hover:text-slate-800"}`}
              >
                Mensal
              </button>
              <button
                type="button"
                onClick={() => setAnnual(true)}
                className={`relative z-10 flex items-center justify-center gap-2 rounded-full px-5 py-2 transition-colors duration-300 ${annual ? "text-primary-foreground" : "text-slate-500 hover:text-slate-800"}`}
              >
                Anual
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold transition-colors duration-300 ${annual ? "bg-primary-foreground/20" : "bg-primary/10 text-primary"}`}
                >
                  -18%
                </span>
              </button>
            </div>
          </Reveal>

          <Reveal delay={100} className="mt-14 overflow-x-auto rounded-3xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-900/[0.02]">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="w-1/4 align-bottom" />
                  {plans.map((plan) => (
                    <th
                      key={plan.name}
                      className={`relative min-w-[190px] p-6 text-left align-top font-normal ${plan.highlight ? "bg-primary/[0.04]" : ""}`}
                    >
                      {plan.highlight && (
                        <span className="absolute right-6 top-6 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-bold text-primary-foreground">
                          Popular
                        </span>
                      )}
                      <p className="text-base font-bold text-slate-900">{plan.name}</p>
                      <p className="mt-1 text-xs font-normal text-slate-500">{plan.desc}</p>

                      <div className="mt-5 min-h-[3.75rem]">
                        {plan.monthly === null ? (
                          <p className="text-2xl font-extrabold text-slate-900">Sob consulta</p>
                        ) : (
                          <div key={annual ? "annual" : "monthly"} className="animate-in fade-in-0 slide-in-from-bottom-0.5 duration-300">
                            <p className="flex items-baseline gap-1.5">
                              <span className="text-2xl font-extrabold text-slate-900">
                                R$ {annual ? plan.annual : plan.monthly}
                              </span>
                              <span className="text-xs font-normal text-slate-500">/colab./mês</span>
                            </p>
                            <p className="mt-1 text-[11px] font-normal text-slate-400">
                              {annual ? (
                                <>
                                  <span className="line-through">R$ {plan.monthly}</span> cobrado anualmente
                                </>
                              ) : (
                                "cobrado mensalmente"
                              )}
                            </p>
                          </div>
                        )}
                      </div>

                      <Button
                        asChild
                        size="sm"
                        className={`mt-4 w-full rounded-lg font-semibold ${
                          plan.highlight
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "border border-primary/40 bg-white text-primary hover:bg-primary/10"
                        }`}
                        variant={plan.highlight ? "default" : "outline"}
                      >
                        <Link to="/login">{plan.cta}</Link>
                      </Button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {!expanded &&
                  essentialRows.map((row) => (
                    <tr key={row.label} className="border-t border-slate-100 transition-colors hover:bg-slate-50/70">
                      <td className="px-6 py-3.5 text-slate-600">{row.label}</td>
                      {row.values.map((value, i) => (
                        <td key={i} className={`px-6 py-3.5 text-center ${plans[i].highlight ? "bg-primary/[0.04]" : ""}`}>
                          {typeof value === "boolean" ? (
                            value ? (
                              <Check className="mx-auto h-4 w-4 text-primary" />
                            ) : (
                              <Minus className="mx-auto h-4 w-4 text-slate-300" />
                            )
                          ) : (
                            <span className="text-sm font-medium text-slate-700">{value}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}

                {expanded &&
                  featureGroups.map((group) => (
                    <Fragment key={group.title}>
                      <tr className="animate-in fade-in-0 duration-300">
                        <td colSpan={4} className="border-t border-slate-100 bg-slate-50/60 px-6 py-2.5">
                          <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                            {group.title}
                          </span>
                        </td>
                      </tr>
                      {group.rows.map((row) => (
                        <tr
                          key={row.label}
                          className="animate-in fade-in-0 border-t border-slate-100 duration-300 transition-colors hover:bg-slate-50/70"
                        >
                          <td className="px-6 py-3.5 text-slate-600">{row.label}</td>
                          {row.values.map((value, i) => (
                            <td
                              key={i}
                              className={`px-6 py-3.5 text-center ${plans[i].highlight ? "bg-primary/[0.04]" : ""}`}
                            >
                              {typeof value === "boolean" ? (
                                value ? (
                                  <Check className="mx-auto h-4 w-4 text-primary" />
                                ) : (
                                  <Minus className="mx-auto h-4 w-4 text-slate-300" />
                                )
                              ) : (
                                <span className="text-sm font-medium text-slate-700">{value}</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </Fragment>
                  ))}

                <tr className="border-t border-slate-100">
                  <td colSpan={4} className="px-6 py-3.5">
                    <button
                      type="button"
                      onClick={() => setExpanded((v) => !v)}
                      className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
                    >
                      {expanded ? "Ver menos" : "Ver comparação completa"}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                      />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </Reveal>

          <Reveal className="mt-24 mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Perguntas frequentes
            </h2>
            <Accordion type="single" collapsible className="mt-10 border-t border-slate-200">
              {faqs.map((item) => (
                <AccordionItem key={item.q} value={item.q} className="border-slate-200">
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

          {/* Closing — a short reassurance line instead of the full-width gradient CTA
              slab used elsewhere: every plan already has its own CTA button above, so a
              second "talk to sales" block here would just repeat the same action. */}
          <Reveal className="mt-16 flex flex-col items-center gap-3 border-t border-slate-200 pt-10 text-center">
            <p className="text-sm text-slate-500">
              14 dias grátis em qualquer plano · sem cartão de crédito · cancele quando quiser
            </p>
            <Link to="/sobre" className="group inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Ainda com dúvidas? Fale com o nosso time
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </main>
      </div>

      <MarketingFooter />
    </div>
  );
}
