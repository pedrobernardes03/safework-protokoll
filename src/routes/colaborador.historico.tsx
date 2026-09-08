import { createFileRoute } from "@tanstack/react-router";
import { CollaboratorShell } from "@/components/safework/CollaboratorShell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, MessageSquare, Package } from "lucide-react";
import { observacoes, entregas, logsAuditoria, colaboradores, MATRICULA_COLABORADOR_ATUAL } from "@/lib/safework-data";

export const Route = createFileRoute("/colaborador/historico")({
  head: () => ({ meta: [{ title: "Histórico — SafeWork" }] }),
  component: Historico,
});

type ItemHistorico = { data: string; tipo: "confirmacao" | "observacao" | "entrega"; texto: string };

const tipoLabels: Record<ItemHistorico["tipo"], string> = {
  confirmacao: "Confirmação",
  observacao: "Observação",
  entrega: "Entrega",
};

function formatData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

// Antes esta tela era uma lista estática, sem relação nenhuma com o que o colaborador
// realmente fazia nas outras telas (confirmar EPI, registrar observação) — nada do que
// ele fizesse aparecia aqui. Agora é uma linha do tempo de verdade, montada a partir dos
// mesmos registros compartilhados que Certificados/Observações/Auditoria usam do lado do
// gestor, só filtrados pela matrícula deste colaborador.
function Historico() {
  const colaborador = colaboradores.find((c) => c.matricula === MATRICULA_COLABORADOR_ATUAL);
  const nome = colaborador?.nome ?? "";

  const historico: ItemHistorico[] = [
    ...observacoes
      .filter((o) => o.matricula === MATRICULA_COLABORADOR_ATUAL)
      .map((o) => ({ data: o.data, tipo: "observacao" as const, texto: `Observação sobre ${o.epi} (${o.tipo}).` })),
    ...entregas
      .filter((e) => e.matricula === MATRICULA_COLABORADOR_ATUAL)
      .map((e) => ({ data: e.dataEntrega, tipo: "entrega" as const, texto: `Entrega de ${e.epi} — CA ${e.ca}.` })),
    ...logsAuditoria
      .filter((l) => l.autor === nome && l.acao === "Confirmou uso de EPIs obrigatórios")
      .map((l) => ({ data: l.data, tipo: "confirmacao" as const, texto: "Confirmação de uso dos EPIs obrigatórios." })),
  ].sort((a, b) => b.data.localeCompare(a.data));

  return (
    <CollaboratorShell back={{ to: "/colaborador/meus-epis", label: "Meus EPIs" }}>
      <h1 className="text-2xl font-bold tracking-tight">Histórico</h1>
      <p className="text-sm text-muted-foreground">
        Registros dos últimos dias — confirmações, observações e entregas.
      </p>

      {historico.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
          Nenhum registro ainda. Confirmações, observações e entregas aparecem aqui assim que você registrar algo.
        </p>
      ) : (
        <div className="mt-6">
          {historico.map((h, i) => (
            <div key={i} className="relative flex gap-4 pb-5 last:pb-0">
              {i !== historico.length - 1 && (
                <span className="absolute left-5 top-10 h-[calc(100%-1.5rem)] w-px bg-border" />
              )}
              <div
                className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-4 border-background ${
                  h.tipo === "observacao"
                    ? "bg-destructive/15 text-destructive"
                    : h.tipo === "entrega"
                      ? "bg-success/15 text-success"
                      : "bg-success/15 text-success"
                }`}
              >
                {h.tipo === "observacao" ? (
                  <MessageSquare className="h-5 w-5" />
                ) : h.tipo === "entrega" ? (
                  <Package className="h-5 w-5" />
                ) : (
                  <CheckCircle2 className="h-5 w-5" />
                )}
              </div>
              <Card className="flex-1 shadow-[var(--shadow-card)]">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{h.texto}</p>
                    <p className="text-xs text-muted-foreground">{formatData(h.data)}</p>
                  </div>
                  <Badge variant="outline" className="shrink-0">{tipoLabels[h.tipo]}</Badge>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </CollaboratorShell>
  );
}
