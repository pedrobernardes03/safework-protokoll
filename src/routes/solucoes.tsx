import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  HardHat,
  Users,
  BadgeCheck,
  MessageSquareWarning,
  Boxes,
  History,
  MessageCircle,
  ShoppingCart,
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
    icon: Boxes,
    name: "Almoxarifado",
    desc: "Visão única do estoque de cada EPI — o que já falta, o que está ficando baixo e o que está saudável — pronta para virar pedido de reposição sem passar por planilha.",
    widget: (
      <div className="space-y-4">
        {[
          { name: "Luva de proteção", note: "Em falta", pct: 3, tone: "danger" as const },
          { name: "Óculos de proteção", note: "8 un. restantes", pct: 22, tone: "warn" as const },
          { name: "Capacete de segurança", note: "46 un. restantes", pct: 92, tone: "ok" as const },
        ].map((item) => (
          <div key={item.name}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-white/90">{item.name}</span>
              <span
                className={`text-xs font-semibold ${
                  item.tone === "danger" ? "text-red-400" : item.tone === "warn" ? "text-amber-400" : "text-emerald-400"
                }`}
              >
                {item.note}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full ${
                  item.tone === "danger" ? "bg-red-400" : item.tone === "warn" ? "bg-amber-400" : "bg-emerald-400"
                }`}
                style={{ width: `${item.pct}%` }}
              />
            </div>
          </div>
        ))}
        <p className="pt-1 text-xs text-white/40">2 itens abaixo do ponto de reposição · um clique envia a lista ao Compras</p>
      </div>
    ),
  },
  {
    icon: ShoppingCart,
    name: "Compras",
    desc: "O pedido de reposição chega do Almoxarifado pronto, com item, quantidade e CA. Marcar como comprado já dá entrada automática no estoque — sem lançamento manual.",
    widget: (
      <div className="divide-y divide-white/10 border-t border-white/10">
        {[
          { name: "Luva de proteção", qtd: "20 un.", status: "pendente" as const },
          { name: "Óculos de proteção", qtd: "12 un.", status: "pendente" as const },
          { name: "Botina de segurança", qtd: "15 un.", status: "comprado" as const },
        ].map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-3 py-3.5">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white/90">{item.name}</p>
              <p className="text-xs text-white/40">{item.qtd}</p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                item.status === "pendente" ? "bg-amber-400/15 text-amber-300" : "bg-emerald-400/15 text-emerald-400"
              }`}
            >
              {item.status === "pendente" ? "Pendente" : "Comprado"}
            </span>
          </div>
        ))}
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
    icon: History,
    name: "Auditoria",
    desc: "Entrega, troca, aprovação de compra, mudança de acesso: toda ação relevante fica registrada com autor, alvo e horário. Nada se perde entre setores.",
    widget: (
      <div className="divide-y divide-white/10 border-t border-white/10">
        {[
          { linha: "Solicitou compra · Luva de proteção", autor: "Ana Ferreira", quando: "há 8 min" },
          { linha: "Confirmou uso de EPIs obrigatórios", autor: "João Silva", quando: "há 41 min" },
          { linha: "Aprovou certificado renovado · CA 34521", autor: "Bruno Alves", quando: "há 2h" },
        ].map((log) => (
          <div key={log.linha} className="flex items-center justify-between gap-3 py-3.5">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white/90">{log.linha}</p>
              <p className="truncate text-xs text-white/40">{log.autor}</p>
            </div>
            <span className="shrink-0 text-xs text-white/40">{log.quando}</span>
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
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
              Um módulo para cada etapa da{" "}
              <span className="font-serif italic font-medium text-primary">segurança do trabalho.</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
              Da entrega do primeiro EPI ao pedido de reposição no Compras, tudo centralizado em uma
              única plataforma — do colaborador ao almoxarifado.
            </p>
          </Reveal>

          {/* One cohesive product panel instead of a wall of repeated cards — reuses the
              same dark glass-panel language as the homepage's live-monitoring hero, so it
              reads as this site's actual design system rather than a generic tile grid.
              Selecting a module swaps the detail pane instead of stacking eight boxes.
              No entrance animation here: the hero above is this page's one orchestrated
              reveal, everything below just appears — scattering fade-ups on every section
              reads as templated rather than designed. */}
          <div className="mt-16">
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[oklch(0.22_0.04_150)] via-[oklch(0.2_0.03_150)] to-[oklch(0.32_0.08_165)] shadow-2xl shadow-slate-900/30">
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.05]"
                style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "22px 22px" }}
              />
              <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-primary/25 blur-3xl" />

              <div className="relative grid grid-cols-1 lg:grid-cols-[312px_1fr]">
                <nav className="grid grid-cols-2 gap-1.5 border-b border-white/10 p-3 sm:grid-cols-3 lg:flex lg:grid-cols-none lg:flex-col lg:gap-1 lg:border-b-0 lg:border-r lg:p-4">
                  {modules.map((m, i) => (
                    <button
                      key={m.name}
                      onClick={() => setActive(i)}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors ${
                        i === active ? "bg-white/10 text-white" : "text-white/45 hover:text-white/80"
                      }`}
                    >
                      <m.icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{m.name}</span>
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
          </div>

          {/* Personas — a slim two-column strip, no bordered cards, no small-caps labels */}
          <div className="mt-16 grid grid-cols-1 gap-8 border-t border-slate-200 pt-10 sm:grid-cols-2">
            <div>
              <p className="text-2xl font-extrabold text-slate-900">
                <CountUp value={30} suffix="s" />
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                é o que o <span className="font-semibold text-slate-700">colaborador</span> leva para confirmar
                os EPIs do dia, direto do celular.
              </p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">1</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                painel onde o <span className="font-semibold text-slate-700">gestor</span> acompanha toda a
                equipe, sem planilha paralela.
              </p>
            </div>
          </div>

          {/* Closing — a single quiet line instead of the full-width gradient CTA slab
              used on the other marketing pages. */}
          <div className="mt-16 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Pronta para ver na prática?</h2>
            <Link to="/gestor" className="group inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Explorar a plataforma
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </main>
      </div>

      <MarketingFooter />
    </div>
  );
}
