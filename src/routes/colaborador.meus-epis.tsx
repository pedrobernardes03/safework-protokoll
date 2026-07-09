import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, MessageSquarePlus, History, ShieldCheck } from "lucide-react";
import { CollaboratorShell } from "@/components/safework/CollaboratorShell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { meusEpis } from "@/lib/safework-data";
import { toast } from "sonner";

export const Route = createFileRoute("/colaborador/meus-epis")({
  head: () => ({ meta: [{ title: "Meus EPIs — SafeWork" }] }),
  component: MeusEpis,
});

function MeusEpis() {
  const [confirmed, setConfirmed] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <CollaboratorShell>
      <section className="rounded-2xl border bg-card p-6 shadow-[var(--shadow-card)]">
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
        <h2 className="text-lg font-semibold">EPIs obrigatórios</h2>
        <p className="text-sm text-muted-foreground">
          Confirme que está utilizando todos os equipamentos abaixo.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {meusEpis.map((epi) => (
            <Card key={epi.id} className="overflow-hidden">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <epi.icon className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold">{epi.nome}</p>
                    {epi.obrigatorio && (
                      <Badge variant="outline" className="border-danger/40 bg-danger/10 text-danger">
                        Obrigatório
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">CA {epi.ca}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border bg-card p-6 shadow-[var(--shadow-card)]">
        <label className="flex items-start gap-3">
          <Checkbox
            checked={confirmed}
            onCheckedChange={(v) => setConfirmed(v === true)}
            className="mt-0.5"
          />
          <span className="text-sm">
            Confirmo que estou utilizando <strong>todos os EPIs obrigatórios</strong> descritos
            acima e que estão em boas condições de uso.
          </span>
        </label>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Registro salvo automaticamente em seu histórico diário.
          </p>
          <Button
            size="lg"
            disabled={!confirmed || done}
            onClick={() => {
              setDone(true);
              toast.success("Confirmação registrada com sucesso.");
            }}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            {done ? "Confirmado hoje" : "Confirmar"}
          </Button>
        </div>
      </section>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
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
      </div>
    </CollaboratorShell>
  );
}
