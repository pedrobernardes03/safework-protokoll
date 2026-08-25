import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  HardHat,
  Users,
  BadgeCheck,
  MessageSquareWarning,
  GraduationCap,
  BarChart3,
  MessageCircle,
  FileText,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { MarketingHeader } from "@/components/safework/MarketingHeader";
import { MarketingFooter } from "@/components/safework/MarketingFooter";
import { Reveal } from "@/components/safework/Reveal";
import { CountUp } from "@/components/safework/CountUp";

export const Route = createFileRoute("/solucoes")({
  head: () => ({ meta: [{ title: "Soluções — SafeWork" }] }),
  component: SolucoesPage,
});

const modules = [
  {
    icon: HardHat,
    name: "Gestão de EPIs",
    desc: "Cadastro, entrega, troca e devolução de Equipamentos de Proteção Individual, com histórico completo por colaborador — do pedido à baixa no estoque.",
    widget: (
      <div className="divide-y divide-white/10 border-t border-white/10">
        {[
          { name: "Capacete de segurança", who: "Setor A · João Silva", status: "ok" as const, note: "Em dia" },
          { name: "Luva de proteção", who: "Setor B · Marina Alves", status: "warn" as const, note: "Vence em 3 dias" },
          { name: "Botina de segurança", who: "Setor A · Carlos Souza", status: "ok" as const, note: "Em dia" },
          { name: "Óculos de proteção", who: "Setor C · Ana Lima", status: "ok" as const, note: "Em dia" },
        ].map((item) => (
          <div key={item.name} className="flex items-center gap-3 py-3.5">
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${item.status === "ok" ? "bg-emerald-400" : "bg-amber-400"}`} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white/90">{item.name}</p>
              <p className="truncate text-xs text-white/40">{item.who}</p>
            </div>
            <span className={`shrink-0 text-xs font-semibold ${item.status === "ok" ? "text-emerald-400" : "text-amber-400"}`}>
              {item.note}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: BadgeCheck,
    name: "Certificados de Aprovação",
    desc: "Monitoramento automático de validade de CAs, com alertas antes do vencimento e histórico completo de cada substituição.",
    widget: (
      <div>
        <div className="flex items-end gap-3">
          <p className="text-5xl font-extrabold text-white">
            <CountUp value={24} />
          </p>
          <p className="pb-1.5 text-sm text-white/50">certificados monitorados</p>
        </div>
        <div className="mt-5 flex items-center gap-2.5 rounded-xl bg-amber-400/10 px-4 py-3">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
          <p className="text-xs font-semibold text-amber-300">3 certificados vencendo esta semana</p>
        </div>
        <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-[87%] rounded-full bg-primary" />
        </div>
        <p className="mt-2 text-xs text-white/40">87% dos CAs válidos por mais de 30 dias</p>
      </div>
    ),
  },
  {
    icon: Users,
    name: "Colaboradores",
    desc: "Cadastro centralizado com cargo, setor, supervisor e indicador de conformidade individual de cada colaborador.",
    widget: (
      <div>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2.5">
            {["JS", "MA", "CS"].map((initials, i) => (
              <span
                key={initials}
                className="grid h-10 w-10 place-items-center rounded-full border-2 border-[oklch(0.22_0.04_150)] bg-primary text-xs font-bold text-primary-foreground"
                style={{ opacity: 1 - i * 0.22 }}
              >
                {initials}
              </span>
            ))}
            <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-[oklch(0.22_0.04_150)] bg-white/10 text-xs font-bold text-white/70">
              +125
            </span>
          </div>
          <p className="text-sm text-white/60">
            <span className="text-base font-bold text-white">
              <CountUp value={128} />
            </span>{" "}
            colaboradores ativos
          </p>
        </div>
        <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-[94%] rounded-full bg-emerald-400" />
        </div>
        <p className="mt-2 text-xs text-white/40">94% com conformidade individual em dia</p>
      </div>
    ),
  },
  {
    icon: MessageSquareWarning,
    name: "Observações & Ocorrências",
    desc: "O colaborador reporta um problema com o EPI em segundos; o gestor acompanha e resolve com fluxo guiado até o fechamento.",
    widget: (
      <div className="rounded-xl bg-amber-400/10 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-amber-300">#0472 · Setor B</span>
          <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[11px] font-semibold text-amber-300">
            Em andamento
          </span>
        </div>
        <p className="mt-2 text-sm font-semibold text-white/90">Luva de proteção rasgada</p>
        <p className="mt-1 text-xs text-white/40">Reportado por Marina Alves · há 12 min</p>
        <p className="mt-4 text-xs text-white/40">Tempo médio de resolução: 4h</p>
      </div>
    ),
  },
  {
    icon: GraduationCap,
    name: "Treinamentos",
    desc: "Agenda, controle de presença e certificados de treinamentos de segurança do trabalho, por colaborador e por turma.",
    widget: (
      <div className="space-y-4">
        {[
          { name: "NR-35 · Trabalho em altura", pct: 92 },
          { name: "NR-6 · Uso de EPIs", pct: 78 },
        ].map((t) => (
          <div key={t.name}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white/80">{t.name}</span>
              <span className="font-bold text-primary">{t.pct}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-primary" style={{ width: `${t.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: BarChart3,
    name: "Analytics & Relatórios",
    desc: "Indicadores de conformidade, custo de EPIs e tendências por setor, exportáveis a qualquer momento em PDF ou Excel.",
    widget: (
      <div>
        <div className="flex h-24 items-end gap-2.5">
          {[38, 62, 48, 74, 55, 90, 68].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-sm bg-primary" style={{ height: `${h}%`, opacity: 0.5 + (h / 100) * 0.5 }} />
          ))}
        </div>
        <p className="mt-3 text-xs text-white/40">Conformidade semanal por setor</p>
      </div>
    ),
  },
  {
    icon: MessageCircle,
    name: "Comunicação em tempo real",
    desc: "Chat direto entre colaboradores, gestores e almoxarifado, com notificações automáticas em cada etapa do processo.",
    widget: (
      <div className="space-y-2">
        <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
          Verificar EPI da equipe do Setor B, por favor.
        </div>
        <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white/10 px-4 py-2.5 text-sm text-white/80">
          Feito — luva nova já disponível para retirada.
        </div>
        <p className="pt-1 text-xs text-white/40">Ana · Almoxarifado · agora</p>
      </div>
    ),
  },
  {
    icon: FileText,
    name: "Documentos & Auditoria",
    desc: "Controle de versão de procedimentos e políticas de segurança, com trilha de auditoria completa de cada alteração.",
    widget: (
      <div className="divide-y divide-white/10 border-t border-white/10">
        {[
          { name: "Política de EPIs v3.2", meta: "há 2 dias · Bruno Alves" },
          { name: "Procedimento NR-6", meta: "há 1 semana · Marina Alves" },
          { name: "Checklist de auditoria interna", meta: "há 3 semanas · Carlos Souza" },
        ].map((doc) => (
          <div key={doc.name} className="flex items-center justify-between gap-3 py-3.5">
            <p className="text-sm font-medium text-white/90">{doc.name}</p>
            <span className="shrink-0 text-xs text-white/40">{doc.meta}</span>
          </div>
        ))}
      </div>
    ),
  },
];

function SolucoesPage() {
  const [active, setActive] = useState(0);
  const mod = modules[active];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50 text-slate-800 font-sans">
      <MarketingHeader />

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-[460px]">
          <div className="absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <main className="mx-auto max-w-6xl px-6 pb-28 pt-8">
          <Reveal className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">Soluções SafeWork</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
              Um módulo para cada etapa da{" "}
              <span className="font-serif italic font-medium text-primary">segurança do trabalho.</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
              Da entrega do primeiro EPI ao relatório mensal de conformidade, tudo centralizado em uma
              única plataforma.
            </p>
          </Reveal>

          {/* One cohesive product panel instead of a wall of repeated cards — reuses the
              same dark glass-panel language as the homepage's live-monitoring hero, so it
              reads as this site's actual design system rather than a generic tile grid.
              Selecting a module swaps the detail pane instead of stacking eight boxes. */}
          <Reveal delay={100} className="mt-16">
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[oklch(0.22_0.04_150)] via-[oklch(0.2_0.03_150)] to-[oklch(0.32_0.08_165)] shadow-2xl shadow-slate-900/30">
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.05]"
                style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "22px 22px" }}
              />
              <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-primary/25 blur-3xl" />

              <div className="relative grid grid-cols-1 lg:grid-cols-[280px_1fr]">
                <nav className="flex gap-1 overflow-x-auto border-b border-white/10 p-3 lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r lg:p-4">
                  {modules.map((m, i) => (
                    <button
                      key={m.name}
                      onClick={() => setActive(i)}
                      className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold whitespace-nowrap transition-colors lg:whitespace-normal ${
                        i === active ? "bg-white/10 text-white" : "text-white/45 hover:text-white/80"
                      }`}
                    >
                      <m.icon className="h-4 w-4 shrink-0" />
                      {m.name}
                    </button>
                  ))}
                </nav>

                <div className="relative min-h-[380px] p-8 sm:p-10">
                  <div key={active} className="animate-in fade-in-0 slide-in-from-bottom-1 duration-300">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-white">
                      <mod.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-2xl font-bold text-white">{mod.name}</h3>
                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/50">{mod.desc}</p>
                    <div className="mt-8">{mod.widget}</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Personas — a slim two-column strip, no bordered cards or bullet lists */}
          <Reveal className="mt-16 grid grid-cols-1 gap-8 border-t border-slate-200 pt-10 sm:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Colaborador</p>
              <p className="mt-2 text-2xl font-extrabold text-slate-900">
                <CountUp value={30} suffix="s" />{" "}
                <span className="text-base font-semibold text-slate-400">para confirmar os EPIs do dia</span>
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Gestor</p>
              <p className="mt-2 text-2xl font-extrabold text-slate-900">
                1 <span className="text-base font-semibold text-slate-400">painel para toda a equipe</span>
              </p>
            </div>
          </Reveal>

          {/* Closing — a single quiet line instead of the full-width gradient CTA slab
              used on the other marketing pages. */}
          <Reveal className="mt-16 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Pronta para ver na prática?</h2>
            <Link to="/gestor" className="group inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Explorar a plataforma
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </main>
      </div>

      <MarketingFooter />
    </div>
  );
}
