import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CollaboratorShell } from "@/components/safework/CollaboratorShell";
import { ChatThread } from "@/components/safework/ChatThread";
import { conversas, addMensagem, addNotificacao } from "@/lib/safework-data";

export const Route = createFileRoute("/colaborador/mensagens")({
  head: () => ({ meta: [{ title: "Mensagens — SafeWork" }] }),
  component: MensagensColaboradorPage,
});

// A área do colaborador simula sempre o mesmo usuário (Carlos Menezes, matrícula 10298),
// igual ao resto das telas de colaborador — por isso a conversa é fixa por matrícula.
const MATRICULA = "10298";

function MensagensColaboradorPage() {
  const [, setTick] = useState(0);
  const conversa = conversas.find((c) => c.matricula === MATRICULA);

  const handleSend = (texto: string) => {
    addMensagem(MATRICULA, "Carlos Menezes", "Eletricista", "colaborador", texto);
    addNotificacao({
      tipo: "nova_mensagem",
      titulo: "Nova mensagem — Carlos Menezes",
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
