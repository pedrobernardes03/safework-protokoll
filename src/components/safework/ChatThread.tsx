import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Mensagem } from "@/lib/safework-data";

export function ChatThread({
  mensagens,
  self,
  onSend,
  placeholder,
}: {
  mensagens: Mensagem[];
  self: Mensagem["autor"];
  onSend: (texto: string) => void;
  placeholder?: string;
}) {
  const [texto, setTexto] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [mensagens.length]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {mensagens.map((m) => {
          const isSelf = m.autor === self;
          return (
            <div key={m.id} className={`flex ${isSelf ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                  isSelf ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm bg-muted text-foreground"
                }`}
              >
                <p className="leading-relaxed">{m.texto}</p>
                <p className={`mt-1 text-[10px] ${isSelf ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {new Date(m.data).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <form
        className="flex items-center gap-2 border-t p-3"
        onSubmit={(e) => {
          e.preventDefault();
          const value = texto.trim();
          if (!value) return;
          onSend(value);
          setTexto("");
        }}
      >
        <Input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={placeholder ?? "Digite uma mensagem..."}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!texto.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
