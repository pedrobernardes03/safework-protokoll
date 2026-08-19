import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users,
  HardHat,
  BadgeCheck,
  MessageSquareWarning,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Calendar,
  Activity,
  FileText,
  Settings,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  Package,
  FileCheck2,
  Layers,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import {
  dashboardStats,
  colaboradores,
  observacoes,
  entregas,
  ultimasMovimentacoes,
  colaboradoresAtencao,
  resumoMensal,
  graficoTiposEpi,
  graficoEvolucaoEntregas,
  graficoStatusCa,
  graficoStatusObservacoes,
} from "@/lib/safework-data";

export const Route = createFileRoute("/gestor/")({
  head: () => ({ meta: [{ title: "Dashboard — SafeWork" }] }),
  component: Dashboard,
});

const statusVencimentoMap = {
  vencido: { label: "Vencido", className: "bg-danger/10 text-danger border-danger/30", dot: "bg-danger" },
  proximo: { label: "A Vencer", className: "bg-warning/20 text-warning-foreground border-warning/40", dot: "bg-warning" },
  vigente: { label: "Vigente", className: "bg-success/10 text-success border-success/30", dot: "bg-success" },
};

const modulosCards = [
  {
    to: "/gestor/colaboradores",
    icon: Users,
    title: "Colaboradores",
    desc: "Gestão de equipe e cadastros de funcionários.",
    color: "text-blue-600 bg-blue-500/10 dark:text-blue-400",
  },
  {
    to: "/gestor/epis",
    icon: HardHat,
    title: "EPIs",
    desc: "Catálogo de EPIs, marcas e especificações.",
    color: "text-amber-600 bg-amber-500/10 dark:text-amber-400",
  },
  {
    to: "/gestor/certificados",
    icon: BadgeCheck,
    title: "Certificados (CA)",
    desc: "Monitoramento e conformidade dos CAs.",
    color: "text-purple-600 bg-purple-500/10 dark:text-purple-400",
  },
  {
    to: "/gestor/observacoes",
    icon: MessageSquareWarning,
    title: "Observações",
    desc: "Ocorrências e avarias relatadas pelos usuários.",
    color: "text-rose-600 bg-rose-500/10 dark:text-rose-400",
  },
  {
    to: null,
    action: () => toast.info("Módulo de Relatórios em fase de exportação de PDFs."),
    icon: FileText,
    title: "Relatórios",
    desc: "Relatórios de entregas, termos e auditorias.",
    color: "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400",
  },
  {
    to: null,
    action: () => toast.info("Configurações do sistema acionadas."),
    icon: Settings,
    title: "Configurações",
    desc: "Parâmetros de alerta, perfis e permissões.",
    color: "text-slate-600 bg-slate-500/10 dark:text-slate-400",
  },
];

function Dashboard() {
  const pendentes = observacoes.filter((o) => o.status === "Pendente").length;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Cabeçalho */}
      <section className="flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">Painel de Gestão e Segurança</h2>
            <Badge variant="outline" className="bg-success/10 text-success border-success/30 font-medium">
              <span className="mr-1.5 h-2 w-2 rounded-full bg-success animate-pulse" />
              Operacional Bom ({dashboardStats.taxaConformidade}%)
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Visão geral em tempo real dos colaboradores, entregas e validade de CAs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => toast.success("Relatório sintético gerado com sucesso!")}>
            <FileText className="mr-2 h-4 w-4" /> Exportar Resumo
          </Button>
          <Button size="sm" asChild>
            <Link to="/gestor/certificados">
              <BadgeCheck className="mr-2 h-4 w-4" /> Nova Entrega
            </Link>
          </Button>
        </div>
      </section>

      {/* LINHA 1: Indicadores Principais (KPIs Enriquecidos) */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {/* Colaboradores Ativos */}
        <Card className="relative overflow-hidden transition-all hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Colaboradores
              </span>
              <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <p className="text-2xl font-extrabold">{colaboradores.length}</p>
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 dark:text-blue-300 text-[10px]">
                {dashboardStats.admitidosMes} admitidos no mês
              </Badge>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground border-t pt-2">
              <span>Afastados: <strong>{dashboardStats.afastados}</strong></span>
              <span className="font-medium text-blue-600 hover:underline">
                <Link to="/gestor/colaboradores">Ver todos →</Link>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* CAs Vencidos */}
        <Card className="relative overflow-hidden border-danger/30 bg-danger/5 transition-all hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-danger">
                CAs Vencidos
              </span>
              <div className="rounded-lg bg-danger/10 p-2 text-danger">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <p className="text-2xl font-extrabold text-danger">{dashboardStats.vencidos}</p>
              <Badge variant="outline" className="border-danger/40 bg-danger/10 text-danger text-[10px]">
                {dashboardStats.venceramHoje} venceu hoje
              </Badge>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs border-t border-danger/20 pt-2">
              <span className="text-muted-foreground">Troca imediata</span>
              <Link to="/gestor/certificados" className="font-semibold text-danger hover:underline">
                Ver detalhes →
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Próximos Vencimentos */}
        <Card className="relative overflow-hidden border-warning/30 bg-warning/5 transition-all hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-warning-foreground">
                Próximos Vencimentos
              </span>
              <div className="rounded-lg bg-warning/20 p-2 text-warning-foreground">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <p className="text-2xl font-extrabold text-warning-foreground">{dashboardStats.proximos}</p>
              <span className="text-[11px] font-medium text-muted-foreground">Méd: {dashboardStats.prazoMedioVencimento}</span>
            </div>
            <div className="mt-3 text-xs text-muted-foreground border-t border-warning/20 pt-2 truncate">
              Mais próximo: <strong className="text-foreground">{dashboardStats.colaboradorMaisProximo}</strong>
            </div>
          </CardContent>
        </Card>

        {/* Observações Pendentes */}
        <Card className="relative overflow-hidden transition-all hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Observações
              </span>
              <div className="rounded-lg bg-rose-500/10 p-2 text-rose-600 dark:text-rose-400">
                <MessageSquareWarning className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <p className="text-2xl font-extrabold">{pendentes}</p>
              <Badge variant="outline" className="border-rose-500/30 text-rose-600 text-[10px]">
                {dashboardStats.observacoesCriticas} crítica
              </Badge>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground border-t pt-2 truncate">
              <span className="truncate">Última: {dashboardStats.ultimaObservacao}</span>
            </div>
          </CardContent>
        </Card>

        {/* Taxa de Conformidade & Entregas */}
        <Card className="relative overflow-hidden bg-primary/5 border-primary/20 transition-all hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Conformidade
              </span>
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <p className="text-2xl font-extrabold text-primary">{dashboardStats.taxaConformidade}%</p>
              <span className="text-xs text-muted-foreground">{dashboardStats.episEntreguesMes} entregas/mês</span>
            </div>
            <div className="mt-2">
              <Progress value={dashboardStats.taxaConformidade} className="h-1.5 bg-primary/20" />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* LINHA 2: Área Central (Próximos Vencimentos + Últimas Movimentações) */}
      <section className="grid gap-6 lg:grid-cols-12">
        {/* Tabela Compacta de Próximos Vencimentos (7 cols) */}
        <Card className="lg:col-span-7">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-warning-foreground" />
                Próximos Vencimentos de CAs
              </CardTitle>
              <CardDescription className="text-xs">
                Controle preventivo de validade dos equipamentos em uso
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-xs">
              <Link to="/gestor/certificados">
                Ver todos ({entregas.length}) <ChevronRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-xs">Colaborador</TableHead>
                    <TableHead className="text-xs">EPI / CA</TableHead>
                    <TableHead className="text-xs">Validade</TableHead>
                    <TableHead className="text-xs text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entregas.slice(0, 5).map((e) => {
                    const status = statusVencimentoMap[e.status];
                    const diffDays = Math.ceil(
                      (new Date(e.validade).getTime() - new Date("2026-08-14").getTime()) / (1000 * 3600 * 24)
                    );

                    return (
                      <TableRow key={e.id} className="hover:bg-muted/20">
                        <TableCell className="py-2.5">
                          <div>
                            <p className="text-xs font-semibold leading-tight">{e.colaborador}</p>
                            <p className="text-[11px] text-muted-foreground">{e.cargo}</p>
                          </div>
                        </TableCell>
                        <TableCell className="py-2.5">
                          <div>
                            <p className="text-xs font-medium">{e.epi}</p>
                            <span className="font-mono text-[10px] text-muted-foreground">CA {e.ca}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-2.5 text-xs">
                          {new Date(e.validade).toLocaleDateString("pt-BR")}
                          <p className="text-[10px] text-muted-foreground">
                            {diffDays < 0 ? `${Math.abs(diffDays)}d atrasado` : diffDays === 0 ? "Vence hoje" : `${diffDays}d restantes`}
                          </p>
                        </TableCell>
                        <TableCell className="py-2.5 text-right">
                          <Badge variant="outline" className={`text-[10px] py-0.5 px-2 ${status.className}`}>
                            <span className={`mr-1 h-1.5 w-1.5 rounded-full ${status.dot}`} />
                            {status.label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Últimas Movimentações / Feed de Atividades (5 cols) */}
        <Card className="lg:col-span-5 flex flex-col justify-between">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Últimas Movimentações
              </CardTitle>
              <Badge variant="secondary" className="text-[10px]">6 atividades</Badge>
            </div>
            <CardDescription className="text-xs">Histórico recente de entregas e alterações</CardDescription>
          </CardHeader>
          <CardContent className="p-4 flex-1">
            <div className="space-y-3.5">
              {ultimasMovimentacoes.map((m) => (
                <div key={m.id} className="flex items-start gap-3 text-xs">
                  <div
                    className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs ${
                      m.tipo === "entrega"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : m.tipo === "observacao"
                        ? "bg-rose-500/10 text-rose-600"
                        : m.tipo === "cadastro"
                        ? "bg-blue-500/10 text-blue-600"
                        : "bg-amber-500/10 text-amber-600"
                    }`}
                  >
                    {m.tipo === "entrega" && <Package className="h-3.5 w-3.5" />}
                    {m.tipo === "observacao" && <AlertCircle className="h-3.5 w-3.5" />}
                    {m.tipo === "cadastro" && <UserPlus className="h-3.5 w-3.5" />}
                    {(m.tipo === "ca" || m.tipo === "solicitacao") && <FileCheck2 className="h-3.5 w-3.5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground leading-tight">{m.acao}</p>
                    <p className="text-muted-foreground truncate">{m.detalhe}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{m.dataHora}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* LINHA 3: Resumo Mensal + Colaboradores em Atenção + Painéis Adicionais */}
      <section className="grid gap-6 lg:grid-cols-12">
        {/* Resumo Mensal & Métricas Rápidas (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                Resumo Mensal de Operações
              </CardTitle>
              <CardDescription className="text-xs">Balanço do mês atual comparado ao anterior</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-lg border bg-muted/20 p-3">
                  <p className="text-[11px] text-muted-foreground font-medium">EPIs Entregues</p>
                  <p className="text-xl font-bold mt-1">{resumoMensal.episEntregues.valor}</p>
                  <span className="text-[10px] font-medium text-emerald-600">{resumoMensal.episEntregues.variacao}</span>
                </div>
                <div className="rounded-lg border bg-muted/20 p-3">
                  <p className="text-[11px] text-muted-foreground font-medium">Novos Colaboradores</p>
                  <p className="text-xl font-bold mt-1">{resumoMensal.novosColaboradores.valor}</p>
                  <span className="text-[10px] font-medium text-blue-600">{resumoMensal.novosColaboradores.variacao}</span>
                </div>
                <div className="rounded-lg border bg-muted/20 p-3">
                  <p className="text-[11px] text-muted-foreground font-medium">Observações</p>
                  <p className="text-xl font-bold mt-1">{resumoMensal.observacoesRegistradas.valor}</p>
                  <span className="text-[10px] font-medium text-emerald-600">{resumoMensal.observacoesRegistradas.variacao}</span>
                </div>
                <div className="rounded-lg border bg-muted/20 p-3">
                  <p className="text-[11px] text-muted-foreground font-medium">CAs Vencidos</p>
                  <p className="text-xl font-bold mt-1 text-danger">{resumoMensal.casVencidos.valor}</p>
                  <span className="text-[10px] font-medium text-muted-foreground">{resumoMensal.casVencidos.variacao}</span>
                </div>
                <div className="rounded-lg border bg-muted/20 p-3 sm:col-span-2">
                  <p className="text-[11px] text-muted-foreground font-medium">CAs Renovados</p>
                  <p className="text-xl font-bold mt-1 text-emerald-600">{resumoMensal.casRenovados.valor}</p>
                  <span className="text-[10px] font-medium text-emerald-600">{resumoMensal.casRenovados.variacao}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Painéis com Informações Adicionais */}
          <Card className="bg-accent/10 border-accent">
            <CardContent className="p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                Informações Úteis & Estatísticas Rápidas
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center justify-between rounded border bg-card p-2.5">
                  <span className="text-muted-foreground">Último colaborador:</span>
                  <strong className="text-foreground font-medium">{dashboardStats.ultimoColaborador}</strong>
                </div>
                <div className="flex items-center justify-between rounded border bg-card p-2.5">
                  <span className="text-muted-foreground">Último EPI entregue:</span>
                  <strong className="text-foreground font-medium truncate max-w-[140px]" title={dashboardStats.ultimoEpiEntregue}>
                    {dashboardStats.ultimoEpiEntregue}
                  </strong>
                </div>
                <div className="flex items-center justify-between rounded border bg-card p-2.5">
                  <span className="text-muted-foreground">EPIs ativos em uso:</span>
                  <strong className="text-foreground font-semibold">{dashboardStats.episEmUso} unidades</strong>
                </div>
                <div className="flex items-center justify-between rounded border bg-card p-2.5">
                  <span className="text-muted-foreground">Tempo médio p/ vencimento:</span>
                  <strong className="text-foreground font-semibold">{dashboardStats.tempoMedioVencimentoCas}</strong>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colaboradores que Exigem Atenção (6 cols) */}
        <Card className="lg:col-span-6 flex flex-col justify-between">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2 text-danger">
                <AlertTriangle className="h-4 w-4" />
                Colaboradores que Exigem Atenção
              </CardTitle>
              <Badge variant="outline" className="border-danger/30 text-danger text-[10px]">
                {colaboradoresAtencao.length} pendências críticas
              </Badge>
            </div>
            <CardDescription className="text-xs">Lista prioritária para intervenção imediata da gestão</CardDescription>
          </CardHeader>
          <CardContent className="p-4 flex-1">
            <div className="space-y-3">
              {colaboradoresAtencao.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border p-3 transition hover:border-danger/40 hover:bg-danger/5"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold">{item.nome}</p>
                      <span className="text-[10px] text-muted-foreground">({item.cargo})</span>
                      <Badge
                        variant="outline"
                        className={`text-[9px] py-0 px-1.5 uppercase ${
                          item.prioridade === "alta"
                            ? "bg-danger/10 text-danger border-danger/30"
                            : "bg-warning/20 text-warning-foreground border-warning/40"
                        }`}
                      >
                        {item.prioridade}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.motivo}</p>
                  </div>
                  <Button size="sm" variant="outline" className="h-7 text-xs shrink-0" asChild>
                    <Link to={item.acaoHref as any}>{item.acaoRotulo}</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* LINHA 4: Painel de Gráficos (Recharts) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Análise Gráfica & Indicadores Visuais
          </h3>
          <span className="text-xs text-muted-foreground">Atualizado diariamente</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Gráfico 1: Distribuição de EPIs por Tipo */}
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs font-semibold">Distribuição de EPIs por Tipo</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={graficoTiposEpi}
                      dataKey="quantidade"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={65}
                      paddingAngle={3}
                    >
                      {graficoTiposEpi.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ fontSize: "11px", borderRadius: "8px", background: "var(--card)", borderColor: "var(--border)" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-1 text-[10px] text-muted-foreground">
                {graficoTiposEpi.slice(0, 4).map((g) => (
                  <div key={g.name} className="flex items-center gap-1.5 truncate">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: g.fill }} />
                    <span className="truncate">{g.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Gráfico 2: Evolução das Entregas Mensais */}
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs font-semibold">Evolução Mensal de Entregas</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={graficoEvolucaoEntregas} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                    <Area type="monotone" dataKey="entregas" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-center text-muted-foreground mt-1">Média de 11.5 entregas/mês</p>
            </CardContent>
          </Card>

          {/* Gráfico 3: CAs Válidos × A Vencer × Vencidos */}
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs font-semibold">Status de Validade dos CAs</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={graficoStatusCa} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="status" tick={{ fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                    <Bar dataKey="quantidade" radius={[4, 4, 0, 0]}>
                      {graficoStatusCa.map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-center text-muted-foreground mt-1">14 CAs totalmente conformes</p>
            </CardContent>
          </Card>

          {/* Gráfico 4: Observações Abertas × Resolvidas */}
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs font-semibold">Resolução de Observações</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={graficoStatusObservacoes}
                      dataKey="quantidade"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={65}
                    >
                      {graficoStatusObservacoes.map((entry, index) => (
                        <Cell key={`obs-cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex justify-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Resolvidas (5)</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> Em Análise (2)</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* LINHA 5: Atalhos Compactos dos Módulos (Grid 2 linhas x 3 colunas) */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Acesso Rápido aos Módulos
          </h3>
          <span className="text-xs text-muted-foreground">Formatos compactos de alta eficiência</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {modulosCards.map((c) => {
            const content = (
              <div className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${c.color}`}>
                    <c.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-foreground leading-tight group-hover:text-primary">
                      {c.title}
                    </h4>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">{c.desc}</p>
                  </div>
                </div>
                <div className="ml-2 flex items-center text-xs font-medium text-primary shrink-0 opacity-80 group-hover:opacity-100">
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </div>
              </div>
            );

            if (c.to) {
              return (
                <Link
                  key={c.title}
                  to={c.to}
                  className="group rounded-xl border bg-card shadow-xs transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={c.title}
                onClick={c.action}
                className="group text-left rounded-xl border bg-card shadow-xs transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md w-full"
              >
                {content}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

