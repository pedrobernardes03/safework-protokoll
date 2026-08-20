import { createFileRoute } from "@tanstack/react-router";
import { CollaboratorShell } from "@/components/safework/CollaboratorShell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/colaborador/historico")({
  head: () => ({ meta: [{ title: "Histórico — SafeWork" }] }),
  component: Historico,
});

const historico = [
  { data: "09/07/2026", tipo: "confirmacao", texto: "Confirmação diária de uso dos EPIs." },
  { data: "08/07/2026", tipo: "confirmacao", texto: "Confirmação diária de uso dos EPIs." },
  { data: "07/07/2026", tipo: "observacao", texto: "Observação sobre Capacete (Danificado)." },
  { data: "06/07/2026", tipo: "entrega", texto: "Entrega de nova botina — CA 40551." },
  { data: "05/07/2026", tipo: "confirmacao", texto: "Confirmação diária de uso dos EPIs." },
];

function Historico() {
  return (
    <CollaboratorShell back={{ to: "/colaborador/meus-epis", label: "Meus EPIs" }}>
      <h1 className="text-2xl font-bold tracking-tight">Histórico</h1>
      <p className="text-sm text-muted-foreground">
        Registros dos últimos dias — confirmações, observações e entregas.
      </p>

      <div className="mt-4 space-y-3">
        {historico.map((h, i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-2 p-2">
              <div
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-md ${
                  h.tipo === "observacao"
                    ? "bg-warning/15 text-warning"
                    : h.tipo === "entrega"
                    ? "bg-primary/10 text-primary"
                    : "bg-success/15 text-success"
                }`}
              >
                {h.tipo === "observacao" ? <MessageSquare className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{h.texto}</p>
                <p className="text-xs text-muted-foreground">{h.data}</p>
              </div>
              <Badge variant="outline" className="shrink-0 capitalize">{h.tipo}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </CollaboratorShell>
  );
}
