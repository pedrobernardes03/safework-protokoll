import type { LucideIcon } from "lucide-react";
import { HardHat, Glasses, Shield, Footprints } from "lucide-react";

export type EpiStatus = "vigente" | "proximo" | "vencido";

export interface EpiItem {
  id: string;
  nome: string;
  icon: LucideIcon;
  obrigatorio: boolean;
  ca: string;
  validade: string;
}

export const meusEpis: EpiItem[] = [
  { id: "capacete", nome: "Capacete", icon: HardHat, obrigatorio: true, ca: "12345", validade: "2026-08-15" },
  { id: "oculos", nome: "Óculos de proteção", icon: Glasses, obrigatorio: true, ca: "22987", validade: "2026-11-02" },
  { id: "luvas", nome: "Luvas", icon: Shield, obrigatorio: true, ca: "31402", validade: "2026-03-20" },
  { id: "botina", nome: "Botina", icon: Footprints, obrigatorio: true, ca: "40551", validade: "2027-01-10" },
];

export interface Observacao {
  id: string;
  colaborador: string;
  matricula: string;
  cargo: string;
  epi: string;
  tipo: "Danificado" | "Desgastado" | "Desconfortável" | "Outro";
  descricao: string;
  data: string;
  status: "Pendente" | "Em análise" | "Resolvido";
  acaoTomada?: string;
}

export const observacoes: Observacao[] = [
  {
    id: "OBS-1042",
    colaborador: "Carlos Menezes",
    matricula: "10298",
    cargo: "Eletricista",
    epi: "Capacete",
    tipo: "Danificado",
    descricao: "Rachadura na parte superior após queda de material leve na obra.",
    data: "2026-07-02",
    status: "Pendente",
  },
  {
    id: "OBS-1041",
    colaborador: "Juliana Prado",
    matricula: "10455",
    cargo: "Operadora de máquina",
    epi: "Luvas",
    tipo: "Desgastado",
    descricao: "Costura interna soltando, perdeu aderência.",
    data: "2026-07-01",
    status: "Em análise",
    acaoTomada: "Solicitada nova unidade ao almoxarifado.",
  },
  {
    id: "OBS-1040",
    colaborador: "Rafael Souza",
    matricula: "10122",
    cargo: "Soldador",
    epi: "Óculos de proteção",
    tipo: "Desconfortável",
    descricao: "Haste apertando região temporal, dor após uso prolongado.",
    data: "2026-06-28",
    status: "Resolvido",
    acaoTomada: "Substituído por modelo ajustável CA 22987.",
  },
  {
    id: "OBS-1039",
    colaborador: "Marina Alves",
    matricula: "10390",
    cargo: "Ajudante geral",
    epi: "Botina",
    tipo: "Outro",
    descricao: "Solado descolando na região do bico.",
    data: "2026-06-25",
    status: "Resolvido",
    acaoTomada: "Nova botina entregue, CA 40551.",
  },
];

export function addObservacao(input: {
  colaborador: string;
  matricula: string;
  cargo: string;
  epi: string;
  tipo: Observacao["tipo"];
  descricao: string;
}) {
  const maxNum = Math.max(0, ...observacoes.map((o) => parseInt(o.id.replace("OBS-", ""), 10) || 0));
  const obs: Observacao = {
    id: `OBS-${maxNum + 1}`,
    status: "Pendente",
    data: new Date().toISOString().slice(0, 10),
    ...input,
  };
  observacoes.unshift(obs);
  return obs;
}

export interface Mensagem {
  id: string;
  autor: "gestor" | "colaborador";
  texto: string;
  data: string;
}

export interface Conversa {
  matricula: string;
  colaborador: string;
  cargo: string;
  mensagens: Mensagem[];
}

export const conversas: Conversa[] = [
  {
    matricula: "10298",
    colaborador: "Carlos Menezes",
    cargo: "Eletricista",
    mensagens: [
      { id: "c1", autor: "colaborador", texto: "Bom dia! Reportei uma rachadura no meu capacete essa semana (OBS-1042).", data: "2026-07-02T08:10:00" },
      { id: "c2", autor: "gestor", texto: "Bom dia, Carlos! Recebemos a observação, já estamos verificando com o almoxarifado.", data: "2026-07-02T09:05:00" },
    ],
  },
  {
    matricula: "10455",
    colaborador: "Juliana Prado",
    cargo: "Operadora de máquina",
    mensagens: [
      { id: "j1", autor: "gestor", texto: "Juliana, sobre a OBS-1041: solicitamos uma luva nova ao almoxarifado.", data: "2026-07-01T14:20:00" },
      { id: "j2", autor: "colaborador", texto: "Perfeito, obrigada!", data: "2026-07-01T14:32:00" },
    ],
  },
  {
    matricula: "10122",
    colaborador: "Rafael Souza",
    cargo: "Soldador",
    mensagens: [
      { id: "r1", autor: "gestor", texto: "Rafael, sua OBS-1040 foi resolvida: modelo ajustável CA 22987 já entregue.", data: "2026-06-28T11:00:00" },
      { id: "r2", autor: "colaborador", texto: "Show, muito melhor agora. Valeu!", data: "2026-06-28T11:15:00" },
    ],
  },
];

export function addMensagem(
  matricula: string,
  colaborador: string,
  cargo: string,
  autor: Mensagem["autor"],
  texto: string,
) {
  let conversa = conversas.find((c) => c.matricula === matricula);
  if (!conversa) {
    conversa = { matricula, colaborador, cargo, mensagens: [] };
    conversas.push(conversa);
  }
  conversa.mensagens.push({ id: Math.random().toString(36).slice(2), autor, texto, data: new Date().toISOString() });
  return conversa;
}

export type Perfil = "Colaborador" | "Gestor" | "Administrador";

export interface Colaborador {
  id: string;
  nome: string;
  matricula: string;
  cpf: string;
  cargo: string;
  setor: string;
  email: string;
  perfil: Perfil;
}

export const colaboradores: Colaborador[] = [
  { id: "1", nome: "Ana Beatriz Silva", matricula: "10001", cpf: "123.456.789-00", cargo: "Engenheira de Segurança", setor: "SST", email: "ana.silva@empresa.com", perfil: "Gestor" },
  { id: "2", nome: "Carlos Menezes", matricula: "10298", cpf: "234.567.890-11", cargo: "Eletricista", setor: "Manutenção", email: "carlos.m@empresa.com", perfil: "Colaborador" },
  { id: "3", nome: "Juliana Prado", matricula: "10455", cpf: "345.678.901-22", cargo: "Operadora de máquina", setor: "Produção", email: "juliana.p@empresa.com", perfil: "Colaborador" },
  { id: "4", nome: "Rafael Souza", matricula: "10122", cpf: "456.789.012-33", cargo: "Soldador", setor: "Produção", email: "rafael.s@empresa.com", perfil: "Colaborador" },
  { id: "5", nome: "Marina Alves", matricula: "10390", cpf: "567.890.123-44", cargo: "Ajudante geral", setor: "Logística", email: "marina.a@empresa.com", perfil: "Colaborador" },
];

export interface EntregaEpi {
  id: string;
  colaborador: string;
  matricula: string;
  cargo: string;
  epi: string;
  ca: string;
  dataEntrega: string;
  validade: string;
  status: EpiStatus;
}

export const entregas: EntregaEpi[] = [
  { id: "1", colaborador: "Carlos Menezes", matricula: "10298", cargo: "Eletricista", epi: "Capacete", ca: "12345", dataEntrega: "2025-08-15", validade: "2026-08-15", status: "proximo" },
  { id: "2", colaborador: "Carlos Menezes", matricula: "10298", cargo: "Eletricista", epi: "Luvas isolantes", ca: "31402", dataEntrega: "2025-03-10", validade: "2026-03-20", status: "vencido" },
  { id: "3", colaborador: "Juliana Prado", matricula: "10455", cargo: "Operadora", epi: "Óculos", ca: "22987", dataEntrega: "2025-11-02", validade: "2026-11-02", status: "vigente" },
  { id: "4", colaborador: "Rafael Souza", matricula: "10122", cargo: "Soldador", epi: "Máscara de solda", ca: "50213", dataEntrega: "2025-05-18", validade: "2026-05-18", status: "vencido" },
  { id: "5", colaborador: "Rafael Souza", matricula: "10122", cargo: "Soldador", epi: "Botina", ca: "40551", dataEntrega: "2026-01-10", validade: "2027-01-10", status: "vigente" },
  { id: "6", colaborador: "Marina Alves", matricula: "10390", cargo: "Ajudante geral", epi: "Colete refletivo", ca: "60112", dataEntrega: "2025-09-01", validade: "2026-09-01", status: "proximo" },
];

export const dashboardStats = {
  vencidos: entregas.filter((e) => e.status === "vencido").length,
  proximos: entregas.filter((e) => e.status === "proximo").length,
  vigentes: entregas.filter((e) => e.status === "vigente").length,
  totalColaboradores: 12,
  admitidosMes: 2,
  afastados: 0,
  venceramHoje: 1,
  colaboradorMaisProximo: "Carlos Menezes",
  prazoMedioVencimento: "18 dias",
  observacoesCriticas: 1,
  ultimaObservacao: "OBS-1042 — Carlos Menezes",
  episEntreguesMes: 14,
  casCadastrados: 18,
  colaboradoresSemEpiObrigatorio: 1,
  taxaConformidade: 92.5,
  entregasSemana: 4,
  ultimoColaborador: "Fernando Costa (Manutenção)",
  ultimoEpiEntregue: "Capacete de Segurança (Carlos M.)",
  proximoCaVencer: "CA 12345 (Vence amanhã)",
  episEmUso: 38,
  tempoMedioVencimentoCas: "42 dias",
};

export interface Movimentacao {
  id: string;
  usuario: string;
  acao: string;
  detalhe: string;
  dataHora: string;
  tipo: "entrega" | "observacao" | "cadastro" | "ca" | "solicitacao";
}

export const ultimasMovimentacoes: Movimentacao[] = [
  { id: "1", usuario: "João Silva", acao: "Recebeu Capacete de Proteção", detalhe: "CA 12345 • Unidade Obra A", dataHora: "Hoje, 09:30", tipo: "entrega" },
  { id: "2", usuario: "Carlos Menezes", acao: "Cadastrou observação OBS-1042", detalhe: "Rachadura em capacete de segurança", dataHora: "Hoje, 08:15", tipo: "observacao" },
  { id: "3", usuario: "Ana Beatriz", acao: "Adicionou colaborador", detalhe: "Fernando Costa (Manutenção)", dataHora: "Ontem, 16:40", tipo: "cadastro" },
  { id: "4", usuario: "Sistema", acao: "CA 31402 atualizado", detalhe: "Nova validade emitida pelo MTE", dataHora: "12/08, 14:20", tipo: "ca" },
  { id: "5", usuario: "Marina Alves", acao: "Recebeu Botina de Segurança", detalhe: "CA 40551 • Tam 38", dataHora: "10/08, 11:00", tipo: "entrega" },
  { id: "6", usuario: "Juliana Prado", acao: "Solicitou substituição", detalhe: "Luvas isolantes desgastadas", dataHora: "09/08, 15:10", tipo: "solicitacao" },
];

export interface ColaboradorAtencao {
  id: string;
  nome: string;
  cargo: string;
  motivo: string;
  prioridade: "alta" | "media" | "baixa";
  acaoRotulo: string;
  acaoHref: string;
}

export const colaboradoresAtencao: ColaboradorAtencao[] = [
  { id: "1", nome: "Carlos Menezes", cargo: "Eletricista", motivo: "Sem EPI obrigatório (Luva Isolante)", prioridade: "alta", acaoRotulo: "Entregar EPI", acaoHref: "/gestor/certificados" },
  { id: "2", nome: "Rafael Souza", cargo: "Soldador", motivo: "CA 50213 vencido (Máscara de Solda)", prioridade: "alta", acaoRotulo: "Renovar CA", acaoHref: "/gestor/certificados" },
  { id: "3", nome: "Carlos Menezes", cargo: "Eletricista", motivo: "Observação pendente crítica (Rachadura)", prioridade: "media", acaoRotulo: "Analisar", acaoHref: "/gestor/observacoes" },
  { id: "4", nome: "Fernando Costa", cargo: "Técnico de Manutenção", motivo: "Pendência de entrega no onboarding", prioridade: "media", acaoRotulo: "Agendar", acaoHref: "/gestor/colaboradores" },
];

export const resumoMensal = {
  episEntregues: { valor: 14, variacao: "+18% vs mês ant." },
  novosColaboradores: { valor: 2, variacao: "+100%" },
  observacoesRegistradas: { valor: 6, variacao: "-25%" },
  casVencidos: { valor: 2, variacao: "Estável" },
  casRenovados: { valor: 5, variacao: "+25%" },
};

// Dados para gráficos
export const graficoTiposEpi = [
  { name: "Proteção Cabeça", quantidade: 12, fill: "#3b82f6" },
  { name: "Proteção Ocular", quantidade: 8, fill: "#8b5cf6" },
  { name: "Mãos & Braços", quantidade: 15, fill: "#ec4899" },
  { name: "Calçados", quantidade: 10, fill: "#10b981" },
  { name: "Auditivo & Outros", quantidade: 6, fill: "#f59e0b" },
];

export const graficoEvolucaoEntregas = [
  { mes: "Mar", entregas: 8, devolucoes: 1 },
  { mes: "Abr", entregas: 11, devolucoes: 2 },
  { mes: "Mai", entregas: 9, devolucoes: 0 },
  { mes: "Jun", entregas: 15, devolucoes: 3 },
  { mes: "Jul", entregas: 12, devolucoes: 1 },
  { mes: "Ago", entregas: 14, devolucoes: 2 },
];

export const graficoStatusCa = [
  { status: "Vigentes", quantidade: 14, fill: "oklch(0.6 0.15 155)" },
  { status: "A Vencer (30d)", quantidade: 2, fill: "oklch(0.78 0.16 80)" },
  { status: "Vencidos", quantidade: 2, fill: "oklch(0.6 0.22 27)" },
];

export const graficoStatusObservacoes = [
  { status: "Resolvidas", quantidade: 5, fill: "oklch(0.6 0.15 155)" },
  { status: "Em Análise", quantidade: 2, fill: "oklch(0.42 0.1 150)" },
  { status: "Pendentes", quantidade: 1, fill: "oklch(0.78 0.16 80)" },
];

export type TipoNotificacao = "ca_vencido" | "ca_proximo" | "epi_entregue" | "novo_colaborador" | "nova_observacao" | "nova_mensagem";
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

export const notificacoes: Notificacao[] = [
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

export function addNotificacao(input: { tipo: TipoNotificacao; titulo: string; descricao: string; prioridade: PrioridadeNotificacao; link?: string }) {
  const notif: Notificacao = {
    id: Math.random().toString(36).slice(2),
    dataHora: "Agora",
    lida: false,
    ...input,
  };
  notificacoes.unshift(notif);
  return notif;
}

