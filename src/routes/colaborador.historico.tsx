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
] as const;

const tipoLabels: Record<(typeof historico)[number]["tipo"], string> = {
  confirmacao: "Confirmação",
  observacao: "Observação",
  entrega: "Entrega",
};

function Historico() {
  return (
    <CollaboratorShell back={{ to: "/colaborador/meus-epis", label: "Meus EPIs" }}>
      <h1 className="text-2xl font-bold tracking-tight">Histórico</h1>
      <p className="text-sm text-muted-foreground">
        Registros dos últimos dias — confirmações, observações e entregas.
      </p>

      {/* A connected vertical timeline instead of a plain stack of identical rows —
          matches what "histórico" actually is: a sequence of events, not a list. */}
      <div className="mt-6">
        {historico.map((h, i) => (
          <div key={i} className="relative flex gap-4 pb-5 last:pb-0">
            {i !== historico.length - 1 && (
              <span className="absolute left-5 top-10 h-[calc(100%-1.5rem)] w-px bg-border" />
            )}
            <div
              className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-4 border-background ${
                h.tipo === "observacao"
                  ? "bg-warning/15 text-warning"
                  : h.tipo === "entrega"
                    ? "bg-primary/10 text-primary"
                    : "bg-success/15 text-success"
              }`}
            >
              {h.tipo === "observacao" ? <MessageSquare className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
            </div>
            <Card className="flex-1 shadow-[var(--shadow-card)]">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{h.texto}</p>
                  <p className="text-xs text-muted-foreground">{h.data}</p>
                </div>
                <Badge variant="outline" className="shrink-0">{tipoLabels[h.tipo]}</Badge>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </CollaboratorShell>
  );
}
