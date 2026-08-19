import { createFileRoute } from "@tanstack/react-router";
import {
  HardHat,
  Users,
  BadgeCheck,
  MessageSquareWarning,
  GraduationCap,
  BarChart3,
  MessageCircle,
  FileText,
  User,
  UserCog,
} from "lucide-react";
import { MarketingHeader } from "@/components/safework/MarketingHeader";
import { MarketingFooter } from "@/components/safework/MarketingFooter";
import { MarketingCta } from "@/components/safework/MarketingCta";
import { Reveal } from "@/components/safework/Reveal";

export const Route = createFileRoute("/solucoes")({
  head: () => ({ meta: [{ title: "Soluções — SafeWork" }] }),
  component: SolucoesPage,
});

const solutions = [
  {
    icon: HardHat,
    title: "Gestão de EPIs",
    desc: "Cadastro, entrega, troca e devolução de Equipamentos de Proteção Individual com histórico completo por colaborador.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: BadgeCheck,
    title: "Certificados de Aprovação",
    desc: "Monitoramento automático de validade de CAs, com alertas antes do vencimento e histórico de substituições.",
    color: "bg-emerald-50 text-primary",
  },
  {
    icon: Users,
    title: "Colaboradores",
    desc: "Cadastro centralizado com cargo, setor, supervisor e indicador de conformidade individual.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: MessageSquareWarning,
    title: "Observações & Ocorrências",
    desc: "Colaborador reporta um problema com o EPI em segundos; o gestor acompanha e resolve com fluxo guiado.",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: GraduationCap,
    title: "Treinamentos",
    desc: "Agenda, controle de presença e certificados de treinamentos de segurança do trabalho.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: BarChart3,
    title: "Analytics & Relatórios",
    desc: "Indicadores de conformidade, custo de EPIs e tendências por setor, exportáveis a qualquer momento.",
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    icon: MessageCircle,
    title: "Comunicação em tempo real",
    desc: "Chat direto entre colaboradores, gestores e almoxarifado, com notificações automáticas de cada etapa.",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: FileText,
    title: "Documentos & Auditoria",
    desc: "Controle de versão de procedimentos e políticas, com trilha de auditoria de cada alteração.",
    color: "bg-orange-50 text-orange-600",
  },
] as const;

const personas = [
  {
    icon: User,
    title: "Para o colaborador",
    desc: "Confirma o uso diário de EPIs, acompanha certificados e reporta problemas em poucos toques.",
  },
  {
    icon: UserCog,
    title: "Para o gestor",
    desc: "Visão completa da equipe, aprovações, indicadores de conformidade e ocorrências em um só painel.",
  },
] as const;

function SolucoesPage() {
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
              Soluções SafeWork
            </div>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl">
              Um módulo para cada etapa da{" "}
              <span className="bg-gradient-to-r from-primary to-[oklch(0.65_0.15_205)] bg-clip-text text-transparent">
                segurança do trabalho.
              </span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
              Da entrega do primeiro EPI ao relatório mensal de conformidade, tudo centralizado em uma
              única plataforma.
            </p>
          </Reveal>

          <section className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {solutions.map(({ icon: Icon, title, desc, color }, i) => (
              <Reveal key={title} delay={(i % 4) * 90}>
                <div className="group h-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10">
                  <div
                    className={`grid h-12 w-12 place-items-center rounded-xl ${color} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{desc}</p>
                </div>
              </Reveal>
            ))}
          </section>

          <Reveal className="mt-20 rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm sm:p-10">
            <div className="text-center">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Feito para cada perfil da operação.
              </h2>
              <p className="mt-3 text-sm text-slate-500 sm:text-base">
                Cada área acessa exatamente o que precisa, sem ruído.
              </p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {personas.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50/80 to-primary/5 p-6 transition-colors hover:border-primary/20"
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-primary/20 bg-white text-primary shadow-sm transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <MarketingCta
            title="Pronto para ver a plataforma em ação?"
            description="Acesse a área do gestor e explore o painel completo de conformidade."
            buttonLabel="Explorar a plataforma"
            buttonTo="/gestor"
          />
        </main>
      </div>

      <MarketingFooter />
    </div>
  );
}
