import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Check, MessageSquarePlus, History, ShieldCheck, MessageCircle } from "lucide-react";
import { CollaboratorShell } from "@/components/safework/CollaboratorShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { meusEpis } from "@/lib/safework-data";
import { toast } from "sonner";

export const Route = createFileRoute("/colaborador/meus-epis")({
  head: () => ({ meta: [{ title: "Meus EPIs — SafeWork" }] }),
  component: MeusEpis,
});

function formatValidade(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function MeusEpis() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const checkedCount = meusEpis.filter((e) => checked[e.id]).length;
  const allChecked = checkedCount === meusEpis.length;

  return (
    <CollaboratorShell>
      <section className="rounded-2xl border bg-card p-4 shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Colaborador
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">Carlos Menezes</h1>
            <p className="text-sm text-muted-foreground">Eletricista · Manutenção</p>
          </div>
          <Badge className="shrink-0 bg-success text-success-foreground hover:bg-success">
            <ShieldCheck className="mr-1 h-3.5 w-3.5" /> Em dia
          </Badge>
        </div>
      </section>

      <section className="mt-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">EPIs obrigatórios</h2>
            <p className="text-sm text-muted-foreground">Toque em cada item para confirmar o uso.</p>
          </div>
          <p className="shrink-0 text-sm font-semibold text-primary">
            {checkedCount}/{meusEpis.length}
          </p>
        </div>

        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${(checkedCount / meusEpis.length) * 100}%` }}
          />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {meusEpis.map((epi) => {
            const isChecked = !!checked[epi.id];
            return (
              <button
                key={epi.id}
                type="button"
                onClick={() => setChecked((c) => ({ ...c, [epi.id]: !c[epi.id] }))}
                className={`flex items-center gap-4 rounded-2xl border p-4 text-left shadow-[var(--shadow-card)] transition-colors ${
                  isChecked ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <div
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl transition-colors ${
                    isChecked ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                  }`}
                >
                  {isChecked ? <Check className="h-6 w-6" /> : <epi.icon className="h-6 w-6" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold">{epi.nome}</p>
                    {epi.obrigatorio && !isChecked && (
                      <Badge variant="outline" className="shrink-0 border-danger/40 bg-danger/10 text-danger">
                        Obrigatório
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    CA {epi.ca} · válido até {formatValidade(epi.validade)}
                  </p>
                </div>
                <div
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${
                    isChecked ? "border-primary bg-primary" : "border-muted-foreground/30"
                  }`}
                >
                  {isChecked && <Check className="h-4 w-4 text-primary-foreground" />}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border bg-card p-6 shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {allChecked
              ? "Todos os EPIs confirmados. Registro salvo automaticamente em seu histórico."
              : `Faltam ${meusEpis.length - checkedCount} equipamento${meusEpis.length - checkedCount > 1 ? "s" : ""} para confirmar.`}
          </p>
          <Button
            size="lg"
            disabled={!allChecked || submitted}
            onClick={() => {
              setSubmitted(true);
              toast.success("Confirmação registrada com sucesso.");
            }}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            {submitted ? "Confirmado hoje" : "Concluir confirmação"}
          </Button>
        </div>
      </section>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Button asChild variant="outline" size="lg">
          <Link to="/colaborador/observacao">
            <MessageSquarePlus className="mr-2 h-4 w-4" /> Registrar observação
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/colaborador/historico">
            <History className="mr-2 h-4 w-4" /> Histórico
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/colaborador/mensagens">
            <MessageCircle className="mr-2 h-4 w-4" /> Mensagens
          </Link>
        </Button>
      </div>
    </CollaboratorShell>
  );
}
