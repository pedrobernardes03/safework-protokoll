import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { observacoes, type Observacao } from "@/lib/safework-data";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/gestor/observacoes/$id")({
  head: ({ params }) => ({ meta: [{ title: `Observação ${params.id} — SafeWork` }] }),
  loader: ({ params }) => {
    const obs = observacoes.find((o) => o.id === params.id);
    if (!obs) throw notFound();
    return { obs };
  },
  notFoundComponent: NotFound,
  component: DetailPage,
});

function NotFound() {
  return (
    <div className="mx-auto max-w-md p-8 text-center">
      <h1 className="text-xl font-bold">Observação não encontrada</h1>
      <Button asChild className="mt-4"><Link to="/gestor/observacoes">Voltar</Link></Button>
    </div>
  );
}

const statusStyle: Record<Observacao["status"], string> = {
  Pendente: "bg-danger/10 text-danger border-danger/30",
  "Em análise": "bg-warning/20 text-warning-foreground border-warning/40",
  Resolvido: "bg-success/10 text-success border-success/30",
};

function DetailPage() {
  const { obs } = Route.useLoaderData() as unknown as { obs: Observacao };
  const [status, setStatus] = useState<Observacao["status"]>(obs.status);
  const [acao, setAcao] = useState(obs.acaoTomada ?? "");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/gestor/observacoes"><ArrowLeft className="mr-1 h-4 w-4" /> Todas as observações</Link>
      </Button>

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Observação {obs.id}
              </p>
              <CardTitle className="mt-1 text-xl">{obs.colaborador}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {obs.cargo} · Matrícula {obs.matricula}
              </p>
            </div>
            <Badge variant="outline" className={statusStyle[status]}>{status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Info label="EPI" value={obs.epi} />
            <Info label="Tipo do problema" value={obs.tipo} />
            <Info label="Data do registro" value={new Date(obs.data).toLocaleDateString("pt-BR")} />
            <Info label="ID" value={obs.id} />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Descrição completa
            </p>
            <p className="mt-2 rounded-lg border bg-muted/40 p-4 text-sm leading-relaxed">
              {obs.descricao}
            </p>
          </div>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Alterações salvas.");
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as Observacao["status"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Em análise">Em análise</SelectItem>
                    <SelectItem value="Resolvido">Resolvido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="acao">Ação tomada</Label>
              <Textarea
                id="acao"
                value={acao}
                onChange={(e) => setAcao(e.target.value)}
                rows={4}
                placeholder="Descreva a ação realizada para tratar a ocorrência..."
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit">Salvar alterações</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}
