import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CollaboratorShell } from "@/components/safework/CollaboratorShell";
import { ChatThread } from "@/components/safework/ChatThread";
import { colaboradores, conversas, addMensagem, addNotificacao, MATRICULA_COLABORADOR_ATUAL } from "@/lib/safework-data";

export const Route = createFileRoute("/colaborador/mensagens")({
  head: () => ({ meta: [{ title: "Mensagens — SafeWork" }] }),
  component: MensagensColaboradorPage,
});

function MensagensColaboradorPage() {
  const [, setTick] = useState(0);
  const colaborador = colaboradores.find((c) => c.matricula === MATRICULA_COLABORADOR_ATUAL);
  const conversa = conversas.find((c) => c.matricula === MATRICULA_COLABORADOR_ATUAL);

  const handleSend = (texto: string) => {
    if (!colaborador) return;
    addMensagem(MATRICULA_COLABORADOR_ATUAL, colaborador.nome, colaborador.cargo, "colaborador", texto);
    addNotificacao({
      tipo: "nova_mensagem",
      titulo: `Nova mensagem — ${colaborador.nome}`,
      descricao: texto,
      prioridade: "baixa",
      link: "/gestor/mensagens",
    });
    setTick((t) => t + 1);
  };

  return (
    <CollaboratorShell back={{ to: "/colaborador/meus-epis", label: "Meus EPIs" }}>
      <div className="flex h-[calc(100vh-11rem)] flex-col overflow-hidden rounded-2xl border">
        <div className="border-b p-3.5">
          <p className="text-sm font-semibold">Segurança do Trabalho</p>
          <p className="text-xs text-muted-foreground">Fale com o gestor sobre seus EPIs e ocorrências.</p>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatThread mensagens={conversa?.mensagens ?? []} self="colaborador" onSend={handleSend} />
        </div>
      </div>
    </CollaboratorShell>
  );
}
