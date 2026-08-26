import { createFileRoute, Link } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowRight, AlertCircle, Clock3, CheckCircle2 } from "lucide-react";
import { observacoes, colaboradorRemovido, type Observacao } from "@/lib/safework-data";
import { useState } from "react";

export const Route = createFileRoute("/gestor/observacoes")({
  head: () => ({ meta: [{ title: "Observações — SafeWork" }] }),
  component: ObservacoesPage,
});

type Status = Observacao["status"];

const colunas: { status: Status; icon: typeof AlertCircle; tint: string; text: string; iconBg: string }[] = [
  { status: "Pendente", icon: AlertCircle, tint: "bg-danger/5", text: "text-danger", iconBg: "bg-danger/10" },
  { status: "Em análise", icon: Clock3, tint: "bg-warning/10", text: "text-warning-foreground", iconBg: "bg-warning/20" },
  { status: "Resolvido", icon: CheckCircle2, tint: "bg-success/5", text: "text-success", iconBg: "bg-success/10" },
];

function ObservacoesPage() {
  const [q, setQ] = useState("");

  const filtered = observacoes.filter((o) => {
    const s = q.toLowerCase();
    return o.colaborador.toLowerCase().includes(s) || o.epi.toLowerCase().includes(s) || o.matricula.includes(s);
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Um quadro de triagem por coluna de status, não mais uma lista agrupada com barra
          colorida — Certificados já usa esse padrão; Observações é fundamentalmente um
          fluxo de trabalho (reportado → em análise → resolvido), então o layout reflete
          isso como um kanban em vez de reaproveitar a mesma estrutura. */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Observações dos EPIs</h2>
          <p className="text-sm text-muted-foreground">Acompanhe cada ocorrência do relato até a resolução.</p>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por colaborador, matrícula ou EPI..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {colunas.map((coluna) => {
          const itens = filtered.filter((o) => o.status === coluna.status);
          return (
            <div key={coluna.status} className={`rounded-2xl ${coluna.tint} p-3`}>
              <div className="mb-3 flex items-center gap-2 px-1">
                <coluna.icon className={`h-4 w-4 ${coluna.text}`} />
                <h3 className={`text-sm font-bold ${coluna.text}`}>{coluna.status}</h3>
                <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-background px-1.5 text-xs font-semibold text-foreground">
                  {itens.length}
                </span>
              </div>

              <div className="space-y-2.5">
                {itens.length === 0 && (
                  <p className="rounded-xl border border-dashed p-6 text-center text-xs text-muted-foreground">
                    Nada por aqui.
                  </p>
                )}
                {itens.map((o) => (
                  <Link
                    key={o.id}
                    to="/gestor/observacoes/$id"
                    params={{ id: o.id }}
                    className="group block rounded-xl border bg-background p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold leading-tight">{o.colaborador}</p>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <Badge variant="secondary" className="text-[11px]">{o.epi}</Badge>
                      <span className="text-[11px] text-muted-foreground">Mat. {o.matricula}</span>
                      {colaboradorRemovido(o.matricula) && (
                        <Badge variant="outline" className="text-[10px] text-muted-foreground">Usuário removido</Badge>
                      )}
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{o.descricao}</p>
                    <p className="mt-2 text-[11px] text-muted-foreground">
                      {new Date(o.data).toLocaleDateString("pt-BR")} · {o.id}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
