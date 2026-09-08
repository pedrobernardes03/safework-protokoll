import React, { createContext, useContext, useEffect, useState } from "react";
import {
  notificacoes as notificacoesCompartilhadas,
  inscreverNotificacoes,
  marcarNotificacaoLida,
  marcarTodasNotificacoesLidas,
  removerNotificacao,
  limparNotificacoes,
  type Notificacao,
} from "@/lib/safework-data";

export type { TipoNotificacao, PrioridadeNotificacao, Notificacao } from "@/lib/safework-data";

interface NotificationsContextType {
  notificacoes: Notificacao[];
  naoLidasCount: number;
  badgeTexto: string;
  marcarComoLida: (id: string) => void;
  marcarTodasComoLidas: () => void;
  excluirNotificacao: (id: string) => void;
  limparTodas: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(notificacoesCompartilhadas);

  // Reflete no state do React qualquer mutação feita em qualquer outra tela (RH cadastrando
  // alguém, colaborador mandando mensagem etc.) — sem isso, o sininho só atualizava depois
  // de um F5, porque o state abaixo era lido uma única vez, no mount.
  useEffect(() => {
    return inscreverNotificacoes(() => setNotificacoes([...notificacoesCompartilhadas]));
  }, []);

  const naoLidasCount = notificacoes.filter((n) => !n.lida).length;

  const badgeTexto = naoLidasCount > 99 ? "99+" : naoLidasCount.toString();

  // Cada mutador abaixo já dispara o pub/sub sozinho (ver safework-data.ts), que por sua
  // vez chama o `setNotificacoes` lá de cima — não precisa repetir isso aqui.
  const marcarComoLida = (id: string) => marcarNotificacaoLida(id);
  const marcarTodasComoLidas = () => marcarTodasNotificacoesLidas();
  const excluirNotificacao = (id: string) => removerNotificacao(id);
  const limparTodas = () => limparNotificacoes();

  return (
    <NotificationsContext.Provider
      value={{
        notificacoes,
        naoLidasCount,
        badgeTexto,
        marcarComoLida,
        marcarTodasComoLidas,
        excluirNotificacao,
        limparTodas,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications deve ser usado dentro de um NotificationProvider");
  }
  return context;
}
