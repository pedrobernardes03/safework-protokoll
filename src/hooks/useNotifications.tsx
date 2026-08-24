import React, { createContext, useContext, useState } from "react";
import { notificacoes as notificacoesIniciais, type Notificacao } from "@/lib/safework-data";

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
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(notificacoesIniciais);

  const naoLidasCount = notificacoes.filter((n) => !n.lida).length;

  const badgeTexto = naoLidasCount > 99 ? "99+" : naoLidasCount.toString();

  const marcarComoLida = (id: string) => {
    setNotificacoes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
    );
  };

  const marcarTodasComoLidas = () => {
    setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: true })));
  };

  const excluirNotificacao = (id: string) => {
    setNotificacoes((prev) => prev.filter((n) => n.id !== id));
  };

  const limparTodas = () => {
    setNotificacoes([]);
  };

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
