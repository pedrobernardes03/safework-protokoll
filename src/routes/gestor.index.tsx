import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  AlertTriangle,
  Clock,
  Activity,
  FileText,
  ChevronRight,
  AlertCircle,
  UserPlus,
  Package,
  FileCheck2,
  Users,
  ShieldAlert,
  MessageSquareWarning,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  colaboradores,
  observacoes,
  entregas,
  ultimasMovimentacoes,
  colaboradoresAtencao,
} from "@/lib/safework-data";

export const Route = createFileRoute("/gestor/")({
  head: () => ({ meta: [{ title: "Dashboard — SafeWork" }] }),
  component: Dashboard,
});

const HOJE = new Date("2026-08-14");

const statusVencimentoMap = {
  vencido: { label: "Vencido", className: "bg-danger/10 text-danger border-danger/30", dot: "bg-danger" },
  proximo: { label: "A Vencer", className: "bg-warning/20 text-warning-foreground border-warning/40", dot: "bg-warning" },
  vigente: { label: "Vigente", className: "bg-success/10 text-success border-success/30", dot: "bg-success" },
};

const movimentacaoStyle: Record<string, { className: string; icon: typeof Package }> = {
  entrega: { className: "bg-success/10 text-success", icon: Package },
  observacao: { className: "bg-warning/20 text-warning-foreground", icon: AlertCircle },
  cadastro: { className: "bg-primary/10 text-primary", icon: UserPlus },
  ca: { className: "bg-primary/10 text-primary", icon: FileCheck2 },
  solicitacao: { className: "bg-primary/10 text-primary", icon: FileCheck2 },
};

const periodos = [
  { id: "hoje", label: "Hoje", maxDias: 0 },
  { id: "3dias", label: "Últimos 3 dias", maxDias: 3 },
  { id: "tudo", label: "Tudo", maxDias: Infinity },
] as const;

function diasAtras(dataHora: string): number {
  if (dataHora.startsWith("Hoje")) return 0;
  if (dataHora.startsWith("Ontem")) return 1;
  const [dataParte] = dataHora.split(",");
  const [dia, mes] = dataParte.split("/").map(Number);
  const data = new Date(2026, mes - 1, dia);
  return Math.round((HOJE.getTime() - data.getTime()) / 86_400_000);
}

function Dashboard() {
  const [periodoAtivo, setPeriodoAtivo] = useState<(typeof periodos)[number]["id"]>("3dias");
  const [setorAtivo, setSetorAtivo] = useState<string | null>(null);

  const setores = useMemo(() => Array.from(new Set(colaboradores.map((c) => c.setor))).sort(), []);
  const setorPorNome = useMemo(() => Object.fromEntries(colaboradores.map((c) => [c.nome, c.setor])), []);

  const colaboradoresFiltrados = setorAtivo ? colaboradores.filter((c) => c.setor === setorAtivo) : colaboradores;
  const matriculasFiltradas = useMemo(() => new Set(colaboradoresFiltrados.map((c) => c.matricula)), [colaboradoresFiltrados]);

  const entregasFiltradas = entregas.filter((e) => matriculasFiltradas.has(e.matricula));
  const observacoesFiltradas = observacoes.filter((o) => o.status === "Pendente" && matriculasFiltradas.has(o.matricula));
  const atencaoFiltrada = colaboradoresAtencao.filter((a) => !setorAtivo || setorPorNome[a.nome] === setorAtivo);

  const maxDias = periodos.find((p) => p.id === periodoAtivo)!.maxDias;
  const movimentacoesFiltradas = ultimasMovimentacoes.filter(
    (m) => (!setorAtivo || setorPorNome[m.usuario] === setorAtivo) && diasAtras(m.dataHora) <= maxDias,
  );

  const vencidos = entregasFiltradas.filter((e) => e.status === "vencido").length;
  const proximos = entregasFiltradas.filter((e) => e.status === "proximo").length;
  const conformidade = entregasFiltradas.length
    ? Math.round(((entregasFiltradas.length - vencidos) / entregasFiltradas.length) * 100)
    : 100;

  const vencimentosOrdenados = [...entregasFiltradas].sort(
    (a, b) => new Date(a.validade).getTime() - new Date(b.validade).getTime(),
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Barra de filtros — período + setor recalculam todos os números abaixo em tempo
          real, em vez de uma lista estática. Estrutura própria desta tela: nenhuma outra
          página combina um filtro de período com um filtro de setor lado a lado. */}
      <section className="flex flex-col gap-4 rounded-2xl border bg-muted/30 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="inline-flex shrink-0 rounded-full border bg-background p-1 text-xs font-semibold">
            {periodos.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPeriodoAtivo(p.id)}
                className={`rounded-full px-3 py-1.5 transition-colors ${
                  periodoAtivo === p.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSetorAtivo(null)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                setorAtivo === null ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground hover:border-primary/30"
              }`}
            >
              Todos os setores
            </button>
            {setores.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSetorAtivo(s)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  setorAtivo === s ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground hover:border-primary/30"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.success("Relatório sintético gerado com sucesso!")}>
            <FileText className="mr-2 h-4 w-4" /> Exportar
          </Button>
          <Button size="sm" asChild>
            <Link to="/gestor/certificados">
              <BadgeCheck className="mr-2 h-4 w-4" /> Nova entrega
            </Link>
          </Button>
        </div>
      </section>

      {/* Spotlight — anel de conformidade num painel destacado + tiles compactos ao lado,
          todos recalculados a partir do escopo filtrado acima. */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,300px)_1fr]">
        <div className="flex items-center gap-5 rounded-3xl border border-primary/20 bg-primary/5 p-6">
          <svg width="80" height="80" viewBox="0 0 96 96" className="-rotate-90 shrink-0">
            <circle cx="48" cy="48" r="40" fill="none" stroke="var(--background)" strokeWidth="9" />
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={2 * Math.PI * 40 * (1 - conformidade / 100)}
            />
          </svg>
          <div className="min-w-0">
            <p className="text-3xl font-extrabold text-primary">{conformidade}%</p>
            <p className="text-sm font-medium text-foreground">Conformidade</p>
            <p className="truncate text-xs text-muted-foreground">{setorAtivo ?? "Toda a equipe"}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Link
            to="/gestor/colaboradores"
            className="flex flex-col justify-between rounded-2xl border bg-card p-4 transition hover:border-primary/30"
          >
            <Users className="h-4 w-4 text-primary" />
            <div className="mt-3">
              <p className="text-2xl font-extrabold">{colaboradoresFiltrados.length}</p>
              <p className="text-xs text-muted-foreground">Colaboradores</p>
            </div>
          </Link>
          <Link
            to="/gestor/certificados"
            className="flex flex-col justify-between rounded-2xl border bg-card p-4 transition hover:border-danger/30"
          >
            <ShieldAlert className="h-4 w-4 text-danger" />
            <div className="mt-3">
              <p className="text-2xl font-extrabold text-danger">{vencidos}</p>
              <p className="text-xs text-muted-foreground">CAs vencidos</p>
            </div>
          </Link>
          <Link
            to="/gestor/certificados"
            className="flex flex-col justify-between rounded-2xl border bg-card p-4 transition hover:border-warning/40"
          >
            <Clock className="h-4 w-4 text-warning-foreground" />
            <div className="mt-3">
              <p className="text-2xl font-extrabold text-warning-foreground">{proximos}</p>
              <p className="text-xs text-muted-foreground">A vencer</p>
            </div>
          </Link>
          <Link
            to="/gestor/observacoes"
            className="flex flex-col justify-between rounded-2xl border bg-card p-4 transition hover:border-primary/30"
          >
            <MessageSquareWarning className="h-4 w-4 text-primary" />
            <div className="mt-3">
              <p className="text-2xl font-extrabold">{observacoesFiltradas.length}</p>
              <p className="text-xs text-muted-foreground">Observações</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Conteúdo — painéis com faixa de título tingida (não Card padrão) para não repetir
          a mesma "cara" das telas de Certificados/EPIs. */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="overflow-hidden rounded-3xl border bg-card lg:col-span-7">
          <div className="flex items-center justify-between bg-muted/40 px-5 py-3">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Clock className="h-4 w-4 text-warning-foreground" />
              Próximos vencimentos
            </div>
            <Link to="/gestor/certificados" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
              Ver todos <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y">
            {vencimentosOrdenados.length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-muted-foreground">Nenhuma entrega neste setor.</p>
            )}
            {vencimentosOrdenados.slice(0, 5).map((e) => {
              const status = statusVencimentoMap[e.status];
              const diffDays = Math.ceil((new Date(e.validade).getTime() - HOJE.getTime()) / (1000 * 3600 * 24));
              return (
                <div key={e.id} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/30 sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold leading-tight">{e.colaborador}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{e.cargo}</p>
                  </div>
                  <div className="hidden min-w-0 flex-1 sm:block">
                    <p className="truncate text-xs font-medium">{e.epi}</p>
                    <span className="font-mono text-[10px] text-muted-foreground">CA {e.ca}</span>
                  </div>
                  <div className="min-w-0 shrink-0 text-right text-xs sm:w-[100px] sm:text-left">
                    {new Date(e.validade).toLocaleDateString("pt-BR")}
                    <p className="whitespace-nowrap text-[10px] text-muted-foreground">
                      {diffDays < 0 ? `${Math.abs(diffDays)}d atrasado` : diffDays === 0 ? "Vence hoje" : `${diffDays}d restantes`}
                    </p>
                  </div>
                  <Badge variant="outline" className={`shrink-0 px-2 py-0.5 text-[10px] ${status.className}`}>
                    <span className={`mr-1 h-1.5 w-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border bg-card lg:col-span-5">
          <div className="flex items-center justify-between bg-danger/10 px-5 py-3">
            <div className="flex items-center gap-2 text-sm font-bold text-danger">
              <AlertTriangle className="h-4 w-4" />
              Exigem atenção
            </div>
            <Badge variant="outline" className="border-danger/30 text-[10px] text-danger">
              {atencaoFiltrada.length}
            </Badge>
          </div>
          <div className="divide-y">
            {atencaoFiltrada.length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-muted-foreground">Nada pendente neste setor.</p>
            )}
            {atencaoFiltrada.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-bold">{item.nome}</p>
                    <span className="text-[10px] text-muted-foreground">({item.cargo})</span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{item.motivo}</p>
                </div>
                <Button size="sm" variant="outline" className="h-7 shrink-0 text-xs" asChild>
                  <Link to={item.acaoHref as any}>{item.acaoRotulo}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Atividade recente — ticker horizontal de chips, formato que não existe em
          nenhuma outra tela do painel (evita repetir a lista vertical usada acima). */}
      <section>
        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-muted-foreground">
          <Activity className="h-4 w-4" />
          Atividade recente
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {movimentacoesFiltradas.length === 0 && (
            <p className="py-3 text-sm text-muted-foreground">Nenhuma atividade neste período.</p>
          )}
          {movimentacoesFiltradas.map((m) => {
            const style = movimentacaoStyle[m.tipo];
            return (
              <div
                key={m.id}
                className="flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full border bg-card py-2 pl-2 pr-4 text-xs"
              >
                <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${style.className}`}>
                  <style.icon className="h-3.5 w-3.5" />
                </span>
                <span className="font-semibold">{m.acao}</span>
                <span className="text-muted-foreground">{m.dataHora}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
