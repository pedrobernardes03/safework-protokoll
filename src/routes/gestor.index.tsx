import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users,
  BadgeCheck,
  MessageSquareWarning,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Activity,
  FileText,
  ChevronRight,
  AlertCircle,
  UserPlus,
  Package,
  FileCheck2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, CartesianGrid } from "recharts";
import {
  dashboardStats,
  colaboradores,
  observacoes,
  entregas,
  ultimasMovimentacoes,
  colaboradoresAtencao,
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

const movimentacaoStyle: Record<string, { className: string; icon: typeof Package }> = {
  entrega: { className: "bg-success/10 text-success", icon: Package },
  observacao: { className: "bg-warning/20 text-warning-foreground", icon: AlertCircle },
  cadastro: { className: "bg-primary/10 text-primary", icon: UserPlus },
  ca: { className: "bg-primary/10 text-primary", icon: FileCheck2 },
  solicitacao: { className: "bg-primary/10 text-primary", icon: FileCheck2 },
};

function Dashboard() {
  const pendentes = observacoes.filter((o) => o.status === "Pendente").length;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Cabeçalho — sem repetir o título "Visão Geral" já mostrado na barra superior */}
      <section className="flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            Resumo em tempo real de colaboradores, entregas e validade de CAs.
          </p>
          <Badge variant="outline" className="border-success/30 bg-success/10 font-medium text-success">
            <span className="mr-1.5 h-2 w-2 animate-pulse rounded-full bg-success" />
            {dashboardStats.taxaConformidade}% conforme
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => toast.success("Relatório sintético gerado com sucesso!")}>
            <FileText className="mr-2 h-4 w-4" /> Exportar resumo
          </Button>
          <Button size="sm" asChild>
            <Link to="/gestor/certificados">
              <BadgeCheck className="mr-2 h-4 w-4" /> Nova entrega
            </Link>
          </Button>
        </div>
      </section>

      {/* Indicadores principais */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Colaboradores
              </span>
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <p className="text-2xl font-extrabold">{colaboradores.length}</p>
              <span className="text-[11px] text-muted-foreground">{dashboardStats.admitidosMes} admitidos/mês</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t pt-2.5 text-xs">
              <span className="text-muted-foreground">Afastados: <strong className="text-foreground">{dashboardStats.afastados}</strong></span>
              <Link to="/gestor/colaboradores" className="font-medium text-primary hover:underline">Ver todos →</Link>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">CAs vencidos</span>
              <div className="rounded-lg bg-danger/10 p-2 text-danger">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <p className="text-2xl font-extrabold text-danger">{dashboardStats.vencidos}</p>
              <span className="text-[11px] text-muted-foreground">{dashboardStats.venceramHoje} venceu hoje</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t pt-2.5 text-xs">
              <span className="text-muted-foreground">Troca imediata</span>
              <Link to="/gestor/certificados" className="font-medium text-danger hover:underline">Ver detalhes →</Link>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Próximos vencimentos
              </span>
              <div className="rounded-lg bg-warning/20 p-2 text-warning-foreground">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <p className="text-2xl font-extrabold text-warning-foreground">{dashboardStats.proximos}</p>
              <span className="text-[11px] text-muted-foreground">méd. {dashboardStats.prazoMedioVencimento}</span>
            </div>
            <div className="mt-3 truncate border-t pt-2.5 text-xs text-muted-foreground">
              Mais próximo: <strong className="text-foreground">{dashboardStats.colaboradorMaisProximo}</strong>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Observações
              </span>
              <div className="rounded-lg bg-warning/20 p-2 text-warning-foreground">
                <MessageSquareWarning className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <p className="text-2xl font-extrabold">{pendentes}</p>
              <span className="text-[11px] text-muted-foreground">{dashboardStats.observacoesCriticas} crítica</span>
            </div>
            <div className="mt-3 truncate border-t pt-2.5 text-xs text-muted-foreground">
              Última: {dashboardStats.ultimaObservacao}
            </div>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Conformidade</span>
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <p className="text-2xl font-extrabold text-primary">{dashboardStats.taxaConformidade}%</p>
              <span className="text-[11px] text-muted-foreground">{dashboardStats.episEntreguesMes} entregas/mês</span>
            </div>
            <div className="mt-3 border-t pt-2.5">
              <Progress value={dashboardStats.taxaConformidade} className="h-1.5 bg-primary/20" />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Vencimentos + atividade recente */}
      <section className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-2">
            <div>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Clock className="h-4 w-4 text-warning-foreground" />
                Próximos vencimentos de CAs
              </CardTitle>
              <CardDescription className="text-xs">Controle preventivo de validade dos equipamentos em uso</CardDescription>
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
                    <TableHead className="text-right text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entregas.slice(0, 5).map((e) => {
                    const status = statusVencimentoMap[e.status];
                    const diffDays = Math.ceil(
                      (new Date(e.validade).getTime() - new Date("2026-08-14").getTime()) / (1000 * 3600 * 24),
                    );
                    return (
                      <TableRow key={e.id} className="hover:bg-muted/20">
                        <TableCell className="py-2.5">
                          <p className="text-xs font-semibold leading-tight">{e.colaborador}</p>
                          <p className="text-[11px] text-muted-foreground">{e.cargo}</p>
                        </TableCell>
                        <TableCell className="py-2.5">
                          <p className="text-xs font-medium">{e.epi}</p>
                          <span className="font-mono text-[10px] text-muted-foreground">CA {e.ca}</span>
                        </TableCell>
                        <TableCell className="py-2.5 text-xs">
                          {new Date(e.validade).toLocaleDateString("pt-BR")}
                          <p className="text-[10px] text-muted-foreground">
                            {diffDays < 0 ? `${Math.abs(diffDays)}d atrasado` : diffDays === 0 ? "Vence hoje" : `${diffDays}d restantes`}
                          </p>
                        </TableCell>
                        <TableCell className="py-2.5 text-right">
                          <Badge variant="outline" className={`px-2 py-0.5 text-[10px] ${status.className}`}>
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

        <Card className="flex flex-col justify-between lg:col-span-5">
          <CardHeader className="border-b pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Activity className="h-4 w-4 text-primary" />
                Últimas movimentações
              </CardTitle>
              <Badge variant="secondary" className="text-[10px]">{ultimasMovimentacoes.length} atividades</Badge>
            </div>
            <CardDescription className="text-xs">Histórico recente de entregas e alterações</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-4">
            <div className="space-y-3.5">
              {ultimasMovimentacoes.map((m) => {
                const style = movimentacaoStyle[m.tipo];
                return (
                  <div key={m.id} className="flex items-start gap-3 text-xs">
                    <div className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full ${style.className}`}>
                      <style.icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold leading-tight text-foreground">{m.acao}</p>
                      <p className="truncate text-muted-foreground">{m.detalhe}</p>
                    </div>
                    <span className="whitespace-nowrap text-[10px] text-muted-foreground">{m.dataHora}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Atenção prioritária + indicadores visuais compactos */}
      <section className="grid gap-6 lg:grid-cols-12">
        <Card className="flex flex-col justify-between lg:col-span-7">
          <CardHeader className="border-b pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-danger">
                <AlertTriangle className="h-4 w-4" />
                Colaboradores que exigem atenção
              </CardTitle>
              <Badge variant="outline" className="border-danger/30 text-[10px] text-danger">
                {colaboradoresAtencao.length} pendências
              </Badge>
            </div>
            <CardDescription className="text-xs">Lista prioritária para intervenção imediata da gestão</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-4">
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
                        className={`px-1.5 py-0 text-[9px] uppercase ${
                          item.prioridade === "alta"
                            ? "border-danger/30 bg-danger/10 text-danger"
                            : "border-warning/40 bg-warning/20 text-warning-foreground"
                        }`}
                      >
                        {item.prioridade}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.motivo}</p>
                  </div>
                  <Button size="sm" variant="outline" className="h-7 shrink-0 text-xs" asChild>
                    <Link to={item.acaoHref as any}>{item.acaoRotulo}</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-5">
          <Card>
            <CardHeader className="border-b pb-3">
              <CardTitle className="text-sm font-semibold">Status de validade dos CAs</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-[140px] w-full">
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b pb-3">
              <CardTitle className="text-sm font-semibold">Resolução de observações</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-[110px] w-[110px] shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={graficoStatusObservacoes} dataKey="quantidade" nameKey="status" cx="50%" cy="50%" outerRadius={50}>
                        {graficoStatusObservacoes.map((entry, index) => (
                          <Cell key={`obs-cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  {graficoStatusObservacoes.map((s) => (
                    <span key={s.status} className="flex items-center gap-1.5">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: s.fill }} />
                      {s.status} ({s.quantidade})
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
