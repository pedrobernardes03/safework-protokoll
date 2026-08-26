import type { LucideIcon } from "lucide-react";
import { HardHat, Glasses, Shield, Footprints, ShieldCheck, Ear, Shirt } from "lucide-react";

export type EpiStatus = "vigente" | "proximo" | "vencido";

// Setores da empresa — únicos e compartilhados entre colaboradores e o catálogo de EPIs.
// "Todos" é um setor especial só para EPIs de uso universal (capacete, óculos, etc.);
// nenhum colaborador de verdade tem "Todos" como setor.
export const setores: string[] = ["Todos", "SST", "TI", "Manutenção", "Produção", "Logística"];

export function addSetor(nome: string) {
  if (!setores.includes(nome)) setores.push(nome);
}

// Catálogo geral de EPIs da empresa — gerenciado em /gestor/epis. Quais destes cada
// colaborador é obrigado a usar fica em `Colaborador.episObrigatorios` (ver abaixo),
// não aqui: o catálogo é "o que existe", a atribuição por pessoa é "o que ela usa".
// `setores` é uma lista (um EPI pode servir mais de um setor) — é o que permite sugerir
// automaticamente os EPIs certos assim que o gestor escolhe o setor de um colaborador novo.
export interface Epi {
  id: string;
  nome: string;
  categoria: string;
  ca: string;
  funcao: string;
  setores: string[];
  validade: string;
  estoque: number;
}

export const categoriasEpi: string[] = [
  "Proteção da cabeça",
  "Proteção visual",
  "Proteção das mãos",
  "Proteção dos pés",
  "Proteção facial",
  "Proteção auditiva",
  "Proteção do corpo",
];

export const funcoesEpi: string[] = ["Todos", "Eletricista", "Soldador", "Operador de máquina", "Ajudante geral"];

export const epis: Epi[] = [
  { id: "1", nome: "Capacete de segurança", categoria: "Proteção da cabeça", ca: "12345", funcao: "Todos", setores: ["Todos"], validade: "2027-08-15", estoque: 42 },
  { id: "2", nome: "Óculos de proteção", categoria: "Proteção visual", ca: "22987", funcao: "Todos", setores: ["Todos"], validade: "2027-11-02", estoque: 58 },
  { id: "3", nome: "Luvas isolantes", categoria: "Proteção das mãos", ca: "31402", funcao: "Eletricista", setores: ["Manutenção"], validade: "2026-03-20", estoque: 15 },
  { id: "4", nome: "Botina de segurança", categoria: "Proteção dos pés", ca: "40551", funcao: "Todos", setores: ["Todos"], validade: "2027-01-10", estoque: 30 },
  { id: "5", nome: "Máscara de solda", categoria: "Proteção facial", ca: "50213", funcao: "Soldador", setores: ["Produção"], validade: "2026-05-18", estoque: 8 },
  { id: "6", nome: "Colete refletivo", categoria: "Proteção do corpo", ca: "60112", funcao: "Ajudante geral", setores: ["Logística", "Produção"], validade: "2026-09-01", estoque: 22 },
];

const iconePorCategoria: Record<string, LucideIcon> = {
  "Proteção da cabeça": HardHat,
  "Proteção visual": Glasses,
  "Proteção das mãos": Shield,
  "Proteção dos pés": Footprints,
  "Proteção facial": ShieldCheck,
  "Proteção auditiva": Ear,
  "Proteção do corpo": Shirt,
};

export function iconeParaEpi(categoria: string): LucideIcon {
  return iconePorCategoria[categoria] ?? HardHat;
}

export function addEpi(input: Omit<Epi, "id">): Epi {
  const nextNum = Math.max(0, ...epis.map((e) => Number(e.id) || 0)) + 1;
  const novo: Epi = { id: String(nextNum), ...input };
  epis.unshift(novo);
  return novo;
}

export function updateEpi(atualizado: Epi) {
  const idx = epis.findIndex((e) => e.id === atualizado.id);
  if (idx !== -1) epis[idx] = atualizado;
}

export function removeEpi(id: string) {
  const idx = epis.findIndex((e) => e.id === id);
  if (idx !== -1) epis.splice(idx, 1);
}

export function addCategoriaEpi(nome: string) {
  if (!categoriasEpi.includes(nome)) categoriasEpi.push(nome);
}

export function addFuncaoEpi(nome: string) {
  if (!funcoesEpi.includes(nome)) funcoesEpi.push(nome);
}

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
  // IDs do catálogo `epis` — define exatamente o que aparece no checklist "Meus EPIs"
  // deste colaborador. É o que faz a tela dele não pedir confirmação de um equipamento
  // que a função dele nem usa (ex.: colete para quem não trabalha em pátio/logística).
  episObrigatorios: string[];
  // Desativar é reversível e preserva o histórico (observações, entregas, mensagens);
  // excluir apaga o cadastro. Controlado em /gestor/usuarios, domínio do setor de TI.
  ativo: boolean;
}

export const colaboradores: Colaborador[] = [
  { id: "1", nome: "Ana Beatriz Silva", matricula: "10001", cpf: "123.456.789-00", cargo: "Engenheira de Segurança", setor: "SST", email: "ana.silva@empresa.com", perfil: "Administrador", episObrigatorios: [], ativo: true },
  { id: "2", nome: "Carlos Menezes", matricula: "10298", cpf: "234.567.890-11", cargo: "Eletricista", setor: "Manutenção", email: "carlos.m@empresa.com", perfil: "Colaborador", episObrigatorios: ["1", "2", "3", "4"], ativo: true },
  { id: "3", nome: "Juliana Prado", matricula: "10455", cpf: "345.678.901-22", cargo: "Operadora de máquina", setor: "Produção", email: "juliana.p@empresa.com", perfil: "Colaborador", episObrigatorios: ["1", "2", "4"], ativo: true },
  { id: "4", nome: "Rafael Souza", matricula: "10122", cpf: "456.789.012-33", cargo: "Soldador", setor: "Produção", email: "rafael.s@empresa.com", perfil: "Colaborador", episObrigatorios: ["1", "4", "5"], ativo: true },
  { id: "5", nome: "Marina Alves", matricula: "10390", cpf: "567.890.123-44", cargo: "Ajudante geral", setor: "Logística", email: "marina.a@empresa.com", perfil: "Colaborador", episObrigatorios: ["1", "4", "6"], ativo: true },
  { id: "6", nome: "Rodrigo Lima", matricula: "10007", cpf: "678.901.234-55", cargo: "Analista de TI", setor: "TI", email: "rodrigo.lima@empresa.com", perfil: "Administrador", episObrigatorios: [], ativo: true },
];

// Simula a sessão logada da área do gestor (não há autenticação real ainda) — é o que
// permite telas como /gestor/usuarios saberem se quem está olhando é Administrador.
const MATRICULA_GESTOR_ATUAL = "10001";
export function gestorAtual(): Colaborador {
  return colaboradores.find((c) => c.matricula === MATRICULA_GESTOR_ATUAL)!;
}

export function addColaborador(input: Omit<Colaborador, "id">): Colaborador {
  const novo: Colaborador = { id: Math.random().toString(36).slice(2), ...input };
  colaboradores.unshift(novo);
  return novo;
}

export function updateColaborador(atualizado: Colaborador) {
  const idx = colaboradores.findIndex((c) => c.id === atualizado.id);
  if (idx !== -1) colaboradores[idx] = atualizado;
}

export function removeColaborador(id: string) {
  const idx = colaboradores.findIndex((c) => c.id === id);
  if (idx !== -1) colaboradores.splice(idx, 1);
}

// Observações, entregas e mensagens guardam o nome/matrícula como texto no momento do
// registro — por isso sobrevivem à exclusão do cadastro. Isso só verifica se a pessoa
// ainda existe, para as telas poderem avisar "usuário removido" ao lado do nome.
export function colaboradorRemovido(matricula: string): boolean {
  return !colaboradores.some((c) => c.matricula === matricula);
}

// Log de auditoria — quem fez o quê, e quando. Sem isso, ações sensíveis (excluir
// colaborador, mudar nível de acesso, mexer no catálogo de EPI) só geravam um toast e
// não deixavam rastro nenhum, o que contradiz a proposta de "rastreabilidade" do produto.
export type CategoriaAuditoria = "usuario" | "epi" | "certificado" | "observacao";

export interface LogAuditoria {
  id: string;
  data: string;
  autor: string;
  autorPerfil: Perfil;
  acao: string;
  alvo: string;
  detalhe?: string;
  categoria: CategoriaAuditoria;
}

export const logsAuditoria: LogAuditoria[] = [
  { id: "l1", data: "2026-08-12T09:15:00", autor: "Ana Beatriz Silva", autorPerfil: "Administrador", acao: "Cadastrou colaborador", alvo: "Marina Alves", categoria: "usuario" },
  { id: "l2", data: "2026-08-14T14:20:00", autor: "Ana Beatriz Silva", autorPerfil: "Administrador", acao: "Renovou certificado", alvo: "Luvas isolantes — Carlos Menezes", categoria: "certificado" },
  { id: "l3", data: "2026-08-18T11:05:00", autor: "Ana Beatriz Silva", autorPerfil: "Administrador", acao: "Cadastrou EPI", alvo: "Colete refletivo", categoria: "epi" },
];

export function addLogAuditoria(input: {
  acao: string;
  alvo: string;
  detalhe?: string;
  categoria: CategoriaAuditoria;
  // Por padrão assume que quem agiu foi o gestor logado — passe os dois campos quando a
  // ação partir do lado do colaborador (ex.: ele mesmo registrando uma observação).
  autor?: string;
  autorPerfil?: Perfil;
}) {
  const fallback = gestorAtual();
  const log: LogAuditoria = {
    id: Math.random().toString(36).slice(2),
    data: new Date().toISOString(),
    autor: input.autor ?? fallback.nome,
    autorPerfil: input.autorPerfil ?? fallback.perfil,
    acao: input.acao,
    alvo: input.alvo,
    detalhe: input.detalhe,
    categoria: input.categoria,
  };
  logsAuditoria.unshift(log);
  return log;
}

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

