import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, HardHat, BadgeCheck, MessageSquareWarning, ArrowRight, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { dashboardStats, colaboradores, observacoes } from "@/lib/safework-data";

export const Route = createFileRoute("/gestor/")({
  head: () => ({ meta: [{ title: "Dashboard — SafeWork" }] }),
  component: Dashboard,
});

const cards = [
  {
    to: "/gestor/colaboradores",
    icon: Users,
    title: "Cadastro de Colaboradores",
    desc: "Cadastrar, editar e remover colaboradores.",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    to: "/gestor/epis",
    icon: HardHat,
    title: "Cadastro de EPIs",
    desc: "Cadastrar EPIs, associar funções e CAs.",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    to: "/gestor/certificados",
    icon: BadgeCheck,
    title: "Monitoramento de CAs",
    desc: "Controlar validade dos CAs e histórico de entrega.",
    color: "bg-primary/10 text-primary dark:text-primary",
  },
  {
    to: "/gestor/observacoes",
    icon: MessageSquareWarning,
    title: "Observações dos EPIs",
    desc: "Consultar ocorrências registradas pelos colaboradores.",
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
] as const;

function Dashboard() {
  const pendentes = observacoes.filter((o) => o.status === "Pendente").length;
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section>
        <p className="text-sm text-muted-foreground">Bem-vinda de volta, Ana.</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight">Painel de controle</h2>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Colaboradores ativos" value={colaboradores.length} hint="+2 este mês" tone="primary" />
        <StatCard label="CAs vencidos" value={dashboardStats.vencidos} hint="Ação necessária" tone="danger" />
        <StatCard label="Próximos do vencimento" value={dashboardStats.proximos} hint="Em até 30 dias" tone="warning" />
        <StatCard label="Observações pendentes" value={pendentes} hint="Aguardando análise" tone="primary" />
      </section>

      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Módulos principais
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {cards.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="group rounded-2xl border bg-card p-6 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:border-primary/40"
            >
              <div className={`grid h-12 w-12 place-items-center rounded-xl ${c.color}`}>
                <c.icon className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-base font-semibold">{c.title}</h4>
              <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Acessar
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: number;
  hint: string;
  tone: "primary" | "danger" | "warning";
}) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    danger: "bg-danger/10 text-danger",
    warning: "bg-warning/20 text-warning-foreground",
  };
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <Badge variant="secondary" className={tones[tone]}>
            <TrendingUp className="mr-1 h-3 w-3" />
          </Badge>
        </div>
        <p className="mt-3 text-3xl font-bold">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}
