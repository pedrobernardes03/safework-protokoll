import React, { createContext, useContext, useState } from "react";

export type TipoNotificacao =
  | "ca_vencido"
  | "ca_proximo"
  | "epi_entregue"
  | "novo_colaborador"
  | "nova_observacao";

export type PrioridadeNotificacao = "alta" | "media" | "baixa";

export interface Notificacao {
  id: string;
  tipo: TipoNotificacao;
  titulo: string;
  descricao: string;
  dataHora: string;
  lida: boolean;
  prioridade: PrioridadeNotificacao;
  link?: string;
}

const notificacoesIniciais: Notificacao[] = [
  {
    id: "notif-1",
    tipo: "ca_vencido",
    titulo: "CA Vencido — Luvas Isolantes",
    descricao: "Luvas isolantes (CA 31402) vencidas para Carlos Menezes. Substituição necessária.",
    dataHora: "Há 3 dias",
    lida: false,
    prioridade: "alta",
    link: "/gestor/certificados",
  },
  {
    id: "notif-2",
    tipo: "ca_vencido",
    titulo: "CA Vencido — Máscara de Solda",
    descricao: "Máscara de solda (CA 50213) vencida para Rafael Souza. Requer nova emissão.",
    dataHora: "Há 3 dias",
    lida: false,
    prioridade: "alta",
    link: "/gestor/certificados",
  },
  {
    id: "notif-3",
    tipo: "ca_proximo",
    titulo: "CA Próximo do Vencimento",
    descricao: "Capacete de Segurança (CA 12345) vence amanhã para Carlos Menezes.",
    dataHora: "Hoje, 08:00",
    lida: false,
    prioridade: "media",
    link: "/gestor/certificados",
  },
  {
    id: "notif-4",
    tipo: "nova_observacao",
    titulo: "Nova Ocorrência (OBS-1042)",
    descricao: "Carlos Menezes relatou rachadura no capacete após queda de peça leve.",
    dataHora: "Hoje, 08:15",
    lida: false,
    prioridade: "media",
    link: "/gestor/observacoes",
  },
  {
    id: "notif-5",
    tipo: "epi_entregue",
    titulo: "EPI Entregue com Sucesso",
    descricao: "Capacete de Proteção entregue para João Silva na Unidade Obra A.",
    dataHora: "Hoje, 09:30",
    lida: true,
    prioridade: "baixa",
    link: "/gestor/certificados",
  },
  {
    id: "notif-6",
    tipo: "novo_colaborador",
    titulo: "Novo Colaborador Cadastrado",
    descricao: "Fernando Costa foi adicionado à equipe de Manutenção.",
    dataHora: "Ontem, 16:40",
    lida: true,
    prioridade: "baixa",
    link: "/gestor/colaboradores",
  },
];

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
