import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, MessageCircle, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChatThread } from "@/components/safework/ChatThread";
import { Badge } from "@/components/ui/badge";
import { conversas as conversasIniciais, addMensagem, colaboradorRemovido, type Conversa } from "@/lib/safework-data";

export const Route = createFileRoute("/gestor/mensagens")({
  head: () => ({ meta: [{ title: "Mensagens — SafeWork" }] }),
  component: MensagensPage,
});

function iniciais(nome: string) {
  return nome.split(" ").slice(0, 2).map((n) => n[0]).join("");
}

function MensagensPage() {
  const [conversas, setConversas] = useState<Conversa[]>(conversasIniciais);
  const [q, setQ] = useState("");
  const [selecionada, setSelecionada] = useState<string | null>(conversasIniciais[0]?.matricula ?? null);
  // Controla qual "tela" aparece em telas pequenas — igual WhatsApp: a lista e a conversa
  // nunca dividem espaço no celular, uma substitui a outra por completo. Em telas sm+ isso
  // não importa (as duas colunas ficam sempre visíveis lado a lado, via sm:flex abaixo),
  // então esse estado só existe pra controlar a navegação no celular.
  const [telaCelular, setTelaCelular] = useState<"lista" | "conversa">("lista");

  const abrirConversa = (matricula: string) => {
    setSelecionada(matricula);
    setTelaCelular("conversa");
  };

  const lista = [...conversas]
    .filter((c) => c.colaborador.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => {
      const da = a.mensagens.at(-1)?.data ?? "";
      const db = b.mensagens.at(-1)?.data ?? "";
      return db.localeCompare(da);
    });

  const ativa = conversas.find((c) => c.matricula === selecionada) ?? null;

  const handleSend = (texto: string) => {
    if (!ativa) return;
    addMensagem(ativa.matricula, ativa.colaborador, ativa.cargo, "gestor", texto);
    setConversas([...conversas]);
  };

  return (
    <div className="mx-auto grid h-[calc(100vh-8rem)] max-w-6xl grid-cols-1 overflow-hidden rounded-2xl border sm:grid-cols-[280px_1fr]">
      {/* Lista de conversas — estilo WhatsApp: no celular ocupa a tela inteira sozinha, e
          some quando uma conversa é aberta (troca de "tela" só existe abaixo de sm). */}
      <div
        className={`flex-col border-r ${
          telaCelular === "conversa" ? "hidden sm:flex" : "flex max-sm:animate-in max-sm:fade-in max-sm:slide-in-from-left max-sm:duration-300"
        }`}
      >
        <div className="border-b p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar conversa..." className="pl-9" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {lista.map((c) => {
            const ultima = c.mensagens.at(-1);
            const isActive = c.matricula === selecionada;
            return (
              <button
                key={c.matricula}
                type="button"
                onClick={() => abrirConversa(c.matricula)}
                className={`flex w-full items-center gap-3 border-b px-3 py-3 text-left transition-colors ${isActive ? "bg-muted" : "hover:bg-muted/60"}`}
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">{iniciais(c.colaborador)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{c.colaborador}</p>
                  <p className="truncate text-xs text-muted-foreground">{ultima?.texto ?? "Sem mensagens"}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conversa selecionada — no celular só aparece depois de abrir alguém da lista, e o
          botão de voltar (só existe abaixo de sm) devolve pra lista sem perder a conversa
          selecionada, então reabrir a mesma pessoa volta exatamente de onde parou. */}
      <div
        className={`min-w-0 flex-col ${
          telaCelular === "conversa" ? "flex max-sm:animate-in max-sm:fade-in max-sm:slide-in-from-right max-sm:duration-300" : "hidden sm:flex"
        }`}
      >
        {ativa ? (
          <>
            <div className="flex items-center gap-3 border-b p-3.5">
              <button
                type="button"
                onClick={() => setTelaCelular("lista")}
                aria-label="Voltar para a lista de conversas"
                className="-ml-1.5 shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:hidden"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">{iniciais(ativa.colaborador)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <p className="truncate text-sm font-semibold">{ativa.colaborador}</p>
                  {colaboradorRemovido(ativa.matricula) && (
                    <Badge variant="outline" className="shrink-0 border-muted-foreground/30 text-[10px] text-muted-foreground">
                      Usuário removido
                    </Badge>
                  )}
                </div>
                <p className="truncate text-xs text-muted-foreground">{ativa.cargo}</p>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatThread mensagens={ativa.mensagens} self="gestor" onSend={handleSend} placeholder={`Mensagem para ${ativa.colaborador.split(" ")[0]}...`} />
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-muted-foreground">
            <MessageCircle className="h-8 w-8" />
            <p className="text-sm">Selecione uma conversa</p>
          </div>
        )}
      </div>
    </div>
  );
}
