import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  HardHat,
  Footprints,
  Glasses,
  RefreshCw,
  Send,
  FileClock,
  PackageSearch,
  TriangleAlert,
  IdCard,
  ListChecks,
  ShoppingCart,
  BadgeCheck,
  PackageCheck,
  Clock3,
  Plus,
} from "lucide-react";

// Confete rápido (~1s, sem loop) disparado ao chegar na última etapa — pontuação visual de
// "terminou o tour", pensado pra apresentação. Cada pedacinho recebe posição/cor/atraso
// aleatórios uma única vez (useMemo) pra não recalcular a cada render.
const CONFETTI_COLORS = ["#16a34a", "#f59e0b", "#0ea5e9", "#ef4444", "#8b5cf6", "#059669"];
function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 22 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.25,
        duration: 0.9 + Math.random() * 0.7,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: 5 + Math.random() * 6,
        rotate: Math.random() * 360,
      })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-0 overflow-visible">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 rounded-sm"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.45,
            backgroundColor: p.color,
            transform: `rotate(${p.rotate}deg)`,
            animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}

// Uma cor por etapa/departamento — RH e Compras reaproveitam a MESMA cor de destaque que a
// tela real deles usa (violeta e azul, vistos em gestor.rh.tsx e gestor.compras.tsx); as
// demais foram escolhidas pra não repetir tom entre etapas vizinhas. Classes por extenso
// (não interpoladas) porque o Tailwind precisa ver o nome literal pra gerar o CSS.
const THEMES = {
  violet: {
    badge: "bg-violet-600",
    shadow: "shadow-violet-600/30",
    glow: "bg-violet-500",
    from: "from-violet-500/10",
    to: "to-violet-500/5",
    pillBorder: "border-violet-200",
    pillBg: "bg-violet-50",
    pillText: "text-violet-700",
    cardBorder: "border-violet-100",
    cardBg: "bg-violet-50/50",
    icon: "text-violet-500",
    progress: "bg-violet-600",
  },
  primary: {
    badge: "bg-primary",
    shadow: "shadow-primary/30",
    glow: "bg-primary",
    from: "from-primary/10",
    to: "to-primary/5",
    pillBorder: "border-primary/20",
    pillBg: "bg-primary/5",
    pillText: "text-primary",
    cardBorder: "border-primary/10",
    cardBg: "bg-primary/5",
    icon: "text-primary",
    progress: "bg-primary",
  },
  cyan: {
    badge: "bg-cyan-600",
    shadow: "shadow-cyan-600/30",
    glow: "bg-cyan-500",
    from: "from-cyan-500/10",
    to: "to-cyan-500/5",
    pillBorder: "border-cyan-200",
    pillBg: "bg-cyan-50",
    pillText: "text-cyan-700",
    cardBorder: "border-cyan-100",
    cardBg: "bg-cyan-50/50",
    icon: "text-cyan-500",
    progress: "bg-cyan-600",
  },
  amber: {
    badge: "bg-amber-600",
    shadow: "shadow-amber-600/30",
    glow: "bg-amber-500",
    from: "from-amber-500/10",
    to: "to-amber-500/5",
    pillBorder: "border-amber-200",
    pillBg: "bg-amber-50",
    pillText: "text-amber-700",
    cardBorder: "border-amber-100",
    cardBg: "bg-amber-50/50",
    icon: "text-amber-500",
    progress: "bg-amber-600",
  },
  blue: {
    badge: "bg-blue-600",
    shadow: "shadow-blue-600/30",
    glow: "bg-blue-500",
    from: "from-blue-500/10",
    to: "to-blue-500/5",
    pillBorder: "border-blue-200",
    pillBg: "bg-blue-50",
    pillText: "text-blue-700",
    cardBorder: "border-blue-100",
    cardBg: "bg-blue-50/50",
    icon: "text-blue-500",
    progress: "bg-blue-600",
  },
  teal: {
    badge: "bg-teal-600",
    shadow: "shadow-teal-600/30",
    glow: "bg-teal-500",
    from: "from-teal-500/10",
    to: "to-teal-500/5",
    pillBorder: "border-teal-200",
    pillBg: "bg-teal-50",
    pillText: "text-teal-700",
    cardBorder: "border-teal-100",
    cardBg: "bg-teal-50/50",
    icon: "text-teal-500",
    progress: "bg-teal-600",
  },
  rose: {
    badge: "bg-rose-600",
    shadow: "shadow-rose-600/30",
    glow: "bg-rose-500",
    from: "from-rose-500/10",
    to: "to-rose-500/5",
    pillBorder: "border-rose-200",
    pillBg: "bg-rose-50",
    pillText: "text-rose-700",
    cardBorder: "border-rose-100",
    cardBg: "bg-rose-50/50",
    icon: "text-rose-500",
    progress: "bg-rose-600",
  },
  indigo: {
    badge: "bg-indigo-600",
    shadow: "shadow-indigo-600/30",
    glow: "bg-indigo-500",
    from: "from-indigo-500/10",
    to: "to-indigo-500/5",
    pillBorder: "border-indigo-200",
    pillBg: "bg-indigo-50",
    pillText: "text-indigo-700",
    cardBorder: "border-indigo-100",
    cardBg: "bg-indigo-50/50",
    icon: "text-indigo-500",
    progress: "bg-indigo-600",
  },
  slate: {
    badge: "bg-slate-700",
    shadow: "shadow-slate-700/30",
    glow: "bg-slate-500",
    from: "from-slate-500/10",
    to: "to-slate-500/5",
    pillBorder: "border-slate-200",
    pillBg: "bg-slate-100",
    pillText: "text-slate-700",
    cardBorder: "border-slate-200",
    cardBg: "bg-slate-50",
    icon: "text-slate-500",
    progress: "bg-slate-700",
  },
} as const;
type ThemeKey = keyof typeof THEMES;

type Step = {
  role: string;
  icon: ComponentType<{ className?: string }>;
  theme: ThemeKey;
  label: string;
  title: string;
  desc: string;
  render: () => ReactNode;
};

// Atraso crescente pra listas de itens entrarem em cascata (um depois do outro) em vez de
// tudo aparecer de uma vez — usado junto com `animate-in fade-in-0 slide-in-from-bottom-2`.
const stagger = (i: number) => ({ animationDelay: `${i * 70}ms` });

function Pill({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "danger" | "warning" | "success" }) {
  const tones = {
    default: "border-slate-200 text-slate-500",
    danger: "border-danger/30 bg-danger/10 text-danger",
    warning: "border-warning/40 bg-warning/10 text-warning-foreground",
    success: "border-success/30 bg-success/10 text-success",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

function Avatar({ initials }: { initials: string }) {
  return (
    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
      {initials}
    </div>
  );
}

// Cada preview abaixo é uma recriação simplificada (não um clone pixel-a-pixel) das telas
// reais — feita a partir do conteúdo/rótulos de cada rota em src/routes/, já que tirar
// screenshot das telas reais exigiria login (elas ficam atrás do Supabase). A ordem segue
// o fluxo real do sistema: RH cadastra -> Segurança do Trabalho define os EPIs -> o
// colaborador confirma -> isso mexe no Almoxarifado -> que aciona o Compras quando falta
// -> em paralelo, Certificados, Observações, Mensagens -> e tudo fecha na Auditoria.
const steps: Step[] = [
  {
    role: "RH",
    icon: IdCard,
    theme: "violet",
    label: "RH cadastra",
    title: "Tudo começa no cadastro do RH",
    desc: "O RH cadastra nome, CPF, matrícula, cargo e setor. Assim que salva, o sistema avisa a Segurança do Trabalho: falta definir os EPIs desse colaborador.",
    render: () => (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2 text-[11px] font-medium">
            <span className="rounded-lg bg-primary px-3 py-1.5 text-white">Ativos (12)</span>
            <span className="rounded-lg px-3 py-1.5 text-slate-400">Desativados (2)</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-[11px] font-semibold text-white">
            <Plus className="h-3 w-3" /> Novo colaborador
          </span>
        </div>
        <div className="overflow-hidden rounded-xl border bg-white">
          <div className="grid grid-cols-[1.6fr_1fr_1fr] gap-2 border-b bg-slate-50/80 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            <span>Colaborador</span>
            <span>Matrícula</span>
            <span>Setor</span>
          </div>
          {[
            { initials: "JS", nome: "João Silva", cargo: "Soldador", matricula: "3391", setor: "Produção", novo: false },
            { initials: "MO", nome: "Maria Oliveira", cargo: "Almoxarife", matricula: "3402", setor: "Almoxarifado", novo: false },
            { initials: "PC", nome: "Pedro Costa", cargo: "Ajudante", matricula: "3415", setor: "Produção", novo: true },
          ].map((c, i) => (
            <div
              key={c.nome}
              style={stagger(i)}
              className="grid animate-in fade-in-0 slide-in-from-bottom-2 grid-cols-[1.6fr_1fr_1fr] items-center gap-2 border-b px-3 py-2.5 text-xs duration-300 last:border-b-0"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Avatar initials={c.initials} />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate font-medium text-slate-700">{c.nome}</p>
                    {c.novo && <Pill tone="success">Novo</Pill>}
                  </div>
                  <p className="truncate text-[10px] text-slate-400">{c.cargo}</p>
                </div>
              </div>
              <span className="font-mono text-slate-500">{c.matricula}</span>
              <span className="truncate text-slate-500">{c.setor}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    role: "Segurança do Trabalho",
    icon: ListChecks,
    theme: "primary",
    label: "Define os EPIs",
    title: "A Segurança do Trabalho define o que cada um precisa usar",
    desc: "Com o cadastro pronto, a Segurança do Trabalho entra e escolhe, por pessoa, quais EPIs são obrigatórios — é isso que alimenta o checklist que o colaborador vê na tela seguinte.",
    render: () => (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1.5">
            {["Todos", "Produção", "Almoxarifado"].map((s, i) => (
              <span key={s} className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium ${i === 0 ? "border-primary bg-primary/5 text-primary" : "border-slate-200 text-slate-500"}`}>
                {s}
              </span>
            ))}
          </div>
          <Pill tone="warning"><TriangleAlert className="h-3 w-3 shrink-0" /> 1 sem EPI definido</Pill>
        </div>
        <div className="divide-y rounded-xl border bg-white">
          {[
            { initials: "JS", nome: "João Silva", cargo: "Soldador · Produção", epis: ["Capacete", "Botina"] },
            { initials: "MO", nome: "Maria Oliveira", cargo: "Almoxarife · Almoxarifado", epis: ["Luva", "Colete"] },
            { initials: "PC", nome: "Pedro Costa", cargo: "Ajudante · Produção", epis: [] },
          ].map((c, i) => (
            <div
              key={c.nome}
              style={stagger(i)}
              className="flex animate-in fade-in-0 slide-in-from-bottom-2 flex-wrap items-center gap-3 p-3 duration-300"
            >
              <Avatar initials={c.initials} />
              <div className="min-w-[120px] flex-1">
                <p className="text-sm font-medium text-slate-800">{c.nome}</p>
                <p className="text-xs text-slate-400">{c.cargo}</p>
              </div>
              <div className="flex flex-1 flex-wrap items-center gap-1.5">
                {c.epis.length === 0 ? (
                  <span className="text-xs font-medium text-warning-foreground">Nenhum EPI definido ainda</span>
                ) : (
                  c.epis.map((e) => <Pill key={e}>{e}</Pill>)
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    role: "Colaborador",
    icon: HardHat,
    theme: "cyan",
    label: "Confirma o checklist",
    title: "Só então o colaborador confirma o próprio checklist",
    desc: "Cada colaborador só vê os equipamentos que a função dele exige — nunca uma lista genérica — e confirma em segundos, direto do celular.",
    render: () => (
      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-xl border bg-white p-3">
          <div className="flex items-center gap-3">
            <Avatar initials="JS" />
            <div>
              <p className="text-sm font-semibold text-slate-800">João Silva</p>
              <p className="text-xs text-slate-400">Soldador · Produção</p>
            </div>
          </div>
          <Pill tone="success"><ShieldCheck className="h-3 w-3" /> Em dia</Pill>
        </div>
        <div className="rounded-xl border bg-white p-3">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600">EPIs obrigatórios</span>
            <span className="text-slate-400">3/4 confirmados</span>
          </div>
          <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-3/4 rounded-full bg-primary" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: HardHat, nome: "Capacete", ca: "CA 31.480", ok: true },
              { icon: Glasses, nome: "Óculos", ca: "CA 28.902", ok: true },
              { icon: Footprints, nome: "Botina", ca: "CA 40.115", ok: true },
              { icon: ShieldCheck, nome: "Luva de raspa", ca: "CA 19.774", ok: false },
            ].map((e, i) => (
              <div
                key={e.nome}
                style={stagger(i)}
                className={`flex animate-in fade-in-0 slide-in-from-bottom-2 items-center gap-2 rounded-lg border p-2 duration-300 ${e.ok ? "border-success/30 bg-success/5" : "border-slate-200"}`}
              >
                <e.icon className="h-4 w-4 shrink-0 text-cyan-500" />
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-slate-700">{e.nome}</p>
                  <p className="truncate text-[10px] text-slate-400">{e.ca}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white">
          Concluir confirmação
        </div>
      </div>
    ),
  },
  {
    role: "Almoxarifado",
    icon: PackageSearch,
    theme: "amber",
    label: "Estoque desconta",
    title: "A confirmação já desconta o estoque do Almoxarifado",
    desc: "Cada entrega confirmada tira a peça do estoque na hora — sem planilha separada, sem contagem manual depois. O que fica baixo ou em falta sobe pro topo da lista.",
    render: () => (
      <div className="space-y-3">
        <div className="rounded-xl border bg-white p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600">Estoque total</span>
            <span className="text-slate-400">312 unidades</span>
          </div>
          <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-[70%] bg-success" />
            <div className="h-full w-[20%] bg-warning" />
            <div className="h-full w-[10%] bg-danger" />
          </div>
        </div>
        <div className="space-y-2">
          {[
            { nome: "Luva de raspa", ca: "CA 19.774", status: "Em falta", tone: "danger" as const, qtd: "0 un.", solicitado: true },
            { nome: "Máscara PFF2", ca: "CA 33.220", status: "Estoque baixo", tone: "warning" as const, qtd: "8 un.", solicitado: false },
          ].map((it, i) => (
            <div
              key={it.nome}
              style={stagger(i)}
              className="flex animate-in fade-in-0 slide-in-from-bottom-2 flex-wrap items-center gap-2.5 rounded-lg border bg-white p-2.5 text-xs duration-300"
            >
              <PackageSearch className="h-4 w-4 shrink-0 text-amber-500" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-700">{it.nome} <span className="font-normal text-slate-400">· {it.ca}</span></p>
                <p className="text-slate-400">{it.qtd} em estoque</p>
              </div>
              <Pill tone={it.tone}>{it.status}</Pill>
              {it.solicitado && <Pill><ShoppingCart className="h-3 w-3" /> Solicitado ao Compras</Pill>}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    role: "Compras",
    icon: ShoppingCart,
    theme: "blue",
    label: "Compras repõe",
    title: "O que falta cai direto na fila do Compras",
    desc: "Um clique no Almoxarifado já gera o pedido aqui. O setor de Compras marca como comprado e o estoque é atualizado sozinho — ninguém digita a mesma informação duas vezes.",
    render: () => (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div style={stagger(0)} className="animate-in fade-in-0 zoom-in-95 rounded-xl border bg-white p-2.5 text-center duration-300">
            <Clock3 className="mx-auto h-3.5 w-3.5 text-warning-foreground" />
            <p className="mt-1 text-lg font-extrabold text-warning-foreground">3</p>
            <p className="text-[10px] text-slate-400">Pendentes</p>
          </div>
          <div style={stagger(1)} className="animate-in fade-in-0 zoom-in-95 rounded-xl border bg-white p-2.5 text-center duration-300">
            <ShoppingCart className="mx-auto h-3.5 w-3.5 text-primary" />
            <p className="mt-1 text-lg font-extrabold text-slate-800">47</p>
            <p className="text-[10px] text-slate-400">Un. a comprar</p>
          </div>
          <div style={stagger(2)} className="animate-in fade-in-0 zoom-in-95 rounded-xl border bg-white p-2.5 text-center duration-300">
            <PackageCheck className="mx-auto h-3.5 w-3.5 text-success" />
            <p className="mt-1 text-lg font-extrabold text-success">21</p>
            <p className="text-[10px] text-slate-400">Compradas</p>
          </div>
        </div>
        <div className="divide-y rounded-xl border bg-white text-xs">
          <div style={stagger(0)} className="flex animate-in fade-in-0 slide-in-from-bottom-2 flex-wrap items-center justify-between gap-2 p-3 duration-300">
            <div className="min-w-0">
              <p className="font-semibold text-slate-700">Luva de raspa</p>
              <p className="text-slate-400">CA 19.774 · 20 un. · pedido por Maria Oliveira</p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5 font-semibold text-white">
              <PackageCheck className="h-3 w-3" /> Marcar como comprado
            </span>
          </div>
          <div style={stagger(1)} className="flex animate-in fade-in-0 slide-in-from-bottom-2 flex-wrap items-center justify-between gap-2 p-3 duration-300">
            <div className="min-w-0">
              <p className="font-medium text-slate-600">Máscara PFF2</p>
              <p className="text-slate-400">CA 33.220 · 30 un.</p>
            </div>
            <Pill tone="success">Comprado em 18/09/2026</Pill>
          </div>
        </div>
      </div>
    ),
  },
  {
    role: "Segurança do Trabalho",
    icon: BadgeCheck,
    theme: "teal",
    label: "Certificados",
    title: "Em paralelo, o vencimento dos CAs fica sob controle",
    desc: "A Segurança do Trabalho acompanha o vencimento dos Certificados de Aprovação separado por status — nenhum CA vence de surpresa.",
    render: () => (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div style={stagger(0)} className="animate-in fade-in-0 zoom-in-95 rounded-xl border border-danger/30 bg-danger/5 p-2.5 text-center duration-300">
            <p className="text-lg font-extrabold text-danger">2</p>
            <p className="text-[11px] text-danger">Vencidos</p>
          </div>
          <div style={stagger(1)} className="animate-in fade-in-0 zoom-in-95 rounded-xl border border-warning/30 bg-warning/10 p-2.5 text-center duration-300">
            <p className="text-lg font-extrabold text-warning-foreground">3</p>
            <p className="text-[11px] text-warning-foreground">Próximos</p>
          </div>
          <div style={stagger(2)} className="animate-in fade-in-0 zoom-in-95 rounded-xl border border-success/30 bg-success/5 p-2.5 text-center duration-300">
            <p className="text-lg font-extrabold text-success">41</p>
            <p className="text-[11px] text-success">Vigentes</p>
          </div>
        </div>
        <div className="space-y-2">
          {[
            { nome: "João Silva", epi: "Luva de raspa · CA 19.774", val: "venceu em 12/08/2026", tone: "danger" as const },
            { nome: "Maria Oliveira", epi: "Máscara PFF2 · CA 33.220", val: "vence em 05/10/2026", tone: "warning" as const },
            { nome: "Pedro Costa", epi: "Capacete · CA 31.480", val: "válido até 03/2027", tone: "success" as const },
          ].map((r, i) => (
            <div
              key={r.nome}
              style={stagger(i)}
              className={`flex animate-in fade-in-0 slide-in-from-bottom-2 items-center justify-between rounded-lg border-l-4 bg-white p-2.5 text-xs duration-300 ${r.tone === "danger" ? "border-l-danger" : r.tone === "warning" ? "border-l-warning" : "border-l-success"}`}
            >
              <div className="min-w-0">
                <p className="font-medium text-slate-700">{r.nome}</p>
                <p className="text-slate-400">{r.epi} · {r.val}</p>
              </div>
              <RefreshCw className="h-3.5 w-3.5 shrink-0 text-teal-500" />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    role: "Colaborador → Segurança do Trabalho",
    icon: TriangleAlert,
    theme: "rose",
    label: "Observações",
    title: "Se algo dá errado, vira um fluxo — não um recado perdido",
    desc: "O colaborador registra o que aconteceu com um EPI; a Segurança do Trabalho acompanha tudo em um quadro, do pendente ao resolvido.",
    render: () => (
      <div className="grid grid-cols-3 gap-2 text-xs">
        {[
          { titulo: "Pendente", tone: "danger" as const, n: 2, card: { nome: "João Silva", epi: "Luva de raspa", desc: "Costura da luva rasgou durante o turno." } },
          { titulo: "Em análise", tone: "warning" as const, n: 1, card: { nome: "Maria Oliveira", epi: "Máscara PFF2", desc: "Elástico folgado, não veda direito." } },
          { titulo: "Resolvido", tone: "success" as const, n: 4, card: { nome: "Pedro Costa", epi: "Botina", desc: "Sola descolando na ponta." } },
        ].map((col, i) => (
          <div key={col.titulo} style={stagger(i)} className="animate-in fade-in-0 slide-in-from-bottom-2 rounded-xl border bg-white p-2 duration-300">
            <div className="mb-2 flex items-center justify-between">
              <Pill tone={col.tone}>{col.titulo}</Pill>
              <span className="text-[10px] text-slate-400">{col.n}</span>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-2">
              <p className="font-medium text-slate-700">{col.card.nome}</p>
              <Pill>{col.card.epi}</Pill>
              <p className="mt-1 line-clamp-2 text-[10px] text-slate-400">{col.card.desc}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    role: "Colaborador ↔ Segurança do Trabalho",
    icon: Send,
    theme: "indigo",
    label: "Mensagens",
    title: "Dúvida rápida? Uma conversa registrada, não um WhatsApp pessoal",
    desc: "Dúvida sobre um EPI ou uma entrega vira mensagem direta com a Segurança do Trabalho, com histórico guardado no mesmo lugar de tudo o resto.",
    render: () => (
      <div className="flex gap-2 text-xs">
        <div className="w-2/5 divide-y rounded-xl border bg-white">
          {[
            { initials: "JS", nome: "João Silva", prev: "Minha luva rasgou, e agora?" },
            { initials: "MO", nome: "Maria Oliveira", prev: "Obrigada!" },
          ].map((c, i) => (
            <div
              key={c.nome}
              style={stagger(i)}
              className={`flex animate-in fade-in-0 slide-in-from-left-2 items-center gap-2 p-2 duration-300 ${i === 0 ? "bg-indigo-50" : ""}`}
            >
              <Avatar initials={c.initials} />
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-700">{c.nome}</p>
                <p className="truncate text-[10px] text-slate-400">{c.prev}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-1 flex-col justify-between rounded-xl border bg-white p-2.5">
          <div className="space-y-1.5">
            <div
              style={stagger(0)}
              className="max-w-[80%] animate-in fade-in-0 slide-in-from-bottom-2 rounded-lg rounded-tl-none bg-slate-100 px-2.5 py-1.5 text-slate-600 duration-300"
            >
              Minha luva rasgou, e agora?
            </div>
            <div
              style={stagger(1)}
              className="ml-auto max-w-[80%] animate-in fade-in-0 slide-in-from-bottom-2 rounded-lg rounded-tr-none bg-indigo-50 px-2.5 py-1.5 text-right text-indigo-700 duration-300"
            >
              Já registrei a troca, retira uma nova no almoxarifado.
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 rounded-lg border bg-slate-50 px-2 py-1.5 text-slate-400">
            <span className="flex-1">Escrever mensagem...</span>
            <Send className="h-3.5 w-3.5 text-indigo-500" />
          </div>
        </div>
      </div>
    ),
  },
  {
    role: "Segurança do Trabalho",
    icon: FileClock,
    theme: "slate",
    label: "Auditoria",
    title: "E tudo isso fecha na Auditoria",
    desc: "Cada ação das telas anteriores — cadastro, EPI definido, entrega, compra, renovação de CA — fica registrada com autor, alvo e horário, disponível pra consulta a qualquer momento.",
    render: () => (
      <div className="space-y-2.5">
        {[
          { autor: "RH", acao: "cadastrou", alvo: "Pedro Costa", quando: "hoje 09:10", tone: "default" as const },
          { autor: "Ana Souza", acao: "definiu EPIs obrigatórios de", alvo: "Pedro Costa", quando: "hoje 09:42", tone: "default" as const },
          { autor: "Ana Souza", acao: "aprovou entrega de EPI para", alvo: "João Silva", quando: "hoje 14:32", tone: "success" as const },
          { autor: "Compras", acao: "marcou como comprado", alvo: "Luva de raspa", quando: "hoje 16:05", tone: "success" as const },
        ].map((e, i) => (
          <div key={i} style={stagger(i)} className="flex animate-in fade-in-0 slide-in-from-left-2 items-start gap-2.5 text-xs duration-300">
            <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${e.tone === "success" ? "bg-success" : "bg-primary/50"}`} />
            <div className="min-w-0 flex-1 border-b border-slate-100 pb-2.5">
              <p className="text-slate-600">
                <span className="font-medium text-slate-800">{e.autor}</span> {e.acao}{" "}
                <span className="font-medium text-slate-800">{e.alvo}</span>
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-400">
                <FileClock className="h-3 w-3" /> {e.quando}
              </p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
];

export function HowItWorksOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setStep((s) => Math.min(s + 1, steps.length - 1));
      if (e.key === "ArrowLeft") setStep((s) => Math.max(s - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const current = steps[step];
  const isFirst = step === 0;
  const isLast = step === steps.length - 1;

  const CurrentIcon = current.icon;
  const progressPct = ((step + 1) / steps.length) * 100;
  const theme = THEMES[current.theme];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="animate-pop-in relative flex w-full max-w-3xl flex-col overflow-y-auto rounded-3xl bg-white shadow-2xl max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Confete solto FORA do cabeçalho (que tem overflow-hidden pras manchas de fundo) —
            de dentro dele, o corte de cima do cabeçalho cortava os confetes no meio da
            queda em vez de deixar eles sumirem suavemente. Aqui em cima ele cai livre por
            cima de tudo. */}
        {isLast && <Confetti />}

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-40 grid h-9 w-9 place-items-center rounded-full bg-white/70 text-slate-500 shadow-sm transition-all hover:scale-110 hover:bg-slate-900/10 active:scale-90"
          aria-label="Fechar"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {/* Cabeçalho com manchas animadas de fundo, emblema grande do ícone da etapa (com
            "pop" e um anel pulsando a cada troca) e barra de progresso com brilho passando —
            dá o clima divertido/dinâmico que substituiu o boneco por enquanto, sem depender
            de nenhum asset de imagem. */}
        <div className={`relative shrink-0 overflow-hidden rounded-t-3xl bg-gradient-to-br ${theme.from} via-white ${theme.to} px-6 pb-6 pt-9 transition-colors duration-500 sm:px-10`}>
          <div className={`pointer-events-none absolute -left-10 -top-16 h-40 w-40 animate-blob rounded-full ${theme.glow}/20 blur-3xl transition-colors duration-500`} />
          <div className={`pointer-events-none absolute -right-6 top-10 h-32 w-32 animate-blob rounded-full ${theme.glow}/10 blur-3xl transition-colors duration-500 [animation-delay:4s]`} />

          <div key={step} className="relative flex h-14 w-14 items-center justify-center">
            <div className={`absolute inset-0 animate-glow-pulse rounded-2xl ${theme.glow}`} />
            <div className={`animate-pop-in relative flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg ${theme.badge} ${theme.shadow}`}>
              <CurrentIcon className="h-7 w-7" />
            </div>
          </div>

          <div className="relative mt-4 h-1.5 w-full overflow-hidden rounded-full bg-primary/10">
            <div
              className={`relative h-full overflow-hidden rounded-full transition-all duration-500 ease-out ${theme.progress}`}
              style={{ width: `${progressPct}%` }}
            >
              <div
                className="absolute inset-0 animate-shimmer"
                style={{ backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)", backgroundSize: "200% 100%" }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-8">
          {/* Trilha do sistema inteiro, em ordem — clicável pra pular direto pra qualquer etapa */}
          <div className="-mx-1 mb-6 flex flex-wrap gap-1.5 px-1 sm:gap-2">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const t = THEMES[s.theme];
              const isActive = i === step;
              const isDone = i < step;
              return (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setStep(i)}
                  className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-medium transition-all hover:scale-105 active:scale-95 ${
                    isActive
                      ? `animate-pop-in border-transparent text-white shadow-sm ${t.badge}`
                      : isDone
                        ? `${t.pillBorder} ${t.pillBg} ${t.pillText}`
                        : "border-slate-200 text-slate-400 hover:border-primary/30 hover:text-primary"
                  }`}
                >
                  <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full text-[9px] font-bold ${isActive ? "bg-white/20" : "bg-slate-900/5"}`}>
                    {i + 1}
                  </span>
                  <Icon className="h-3 w-3 shrink-0" />
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
              );
            })}
          </div>

          <div key={step} className="animate-in fade-in-0 slide-in-from-right-3 zoom-in-95 duration-300">
            <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold ${theme.pillBorder} ${theme.pillBg} ${theme.pillText}`}>
              {current.role}
            </span>
            <h3 className="mt-3 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              {current.title}
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">{current.desc}</p>

            <div className={`mt-6 rounded-2xl border p-4 transition-colors duration-500 sm:p-5 ${theme.cardBorder} ${theme.cardBg}`}>
              {current.render()}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between gap-3 pt-4">
            <span className="text-xs font-medium text-slate-400">
              Etapa {step + 1} de {steps.length}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(s - 1, 0))}
                disabled={isFirst}
                className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-all hover:scale-105 hover:bg-slate-100 active:scale-95 disabled:pointer-events-none disabled:opacity-0"
              >
                <ChevronLeft className="h-4 w-4" /> Voltar
              </button>
              {isLast ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/30 transition-all hover:scale-105 hover:bg-primary/90 active:scale-95"
                >
                  Concluir
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.min(s + 1, steps.length - 1))}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:opacity-90 active:scale-95 ${theme.badge} ${theme.shadow}`}
                >
                  Próximo <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
