import type { LucideIcon } from "lucide-react";
import { HardHat, Glasses, Shield, Footprints, ShieldCheck, Ear, Shirt } from "lucide-react";

export type EpiStatus = "vigente" | "proximo" | "vencido";

// Setores da empresa — únicos e compartilhados entre colaboradores e o catálogo de EPIs.
// "Todos" é um setor especial só para EPIs de uso universal (capacete, óculos, etc.);
// nenhum colaborador de verdade tem "Todos" como setor.
export const setores: string[] = ["Todos", "SST", "TI", "Compras", "RH", "Manutenção", "Produção", "Logística"];

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

// EPIs de um setor: os marcados para aquele setor especificamente, mais os de uso
// universal ("Todos", ex.: capacete). Compartilhado entre o cadastro do RH (que usa isso
// só pra pré-preencher um ponto de partida sensato ao criar alguém) e a tela de EPIs por
// Colaborador da Segurança do Trabalho (que usa como atalho de sugestão).
export function episDoSetor(setor: string): Epi[] {
  return epis.filter((e) => e.setores.includes(setor) || e.setores.includes("Todos"));
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

// "Compras" e "RH" são perfis restritos de propósito: cada um só enxerga a própria tela
// (Compras não vê cadastro de gente, RH não vê catálogo de EPI nem certificados) — ver
// AppSidebar.tsx pra saber exatamente o que cada perfil vê no menu. A divisão de trabalho
// em cima do cadastro de colaborador é deliberada: RH cadastra a pessoa (nome, CPF,
// matrícula, cargo, setor, e-mail), a Segurança do Trabalho decide os EPIs obrigatórios
// dela (em /gestor/colaboradores) e o TI controla nível de acesso/desativação (em
// /gestor/usuarios) — três times, três responsabilidades, sem um pisar no trabalho do
// outro.
export type Perfil = "Colaborador" | "Gestor" | "Administrador" | "Compras" | "RH";

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
  { id: "7", nome: "Fernanda Costa", matricula: "10520", cpf: "789.012.345-66", cargo: "Analista de Compras", setor: "Compras", email: "fernanda.costa@empresa.com", perfil: "Compras", episObrigatorios: [], ativo: true },
  { id: "8", nome: "Paloma Ribeiro", matricula: "10610", cpf: "890.123.456-77", cargo: "Analista de RH", setor: "RH", email: "paloma.ribeiro@empresa.com", perfil: "RH", episObrigatorios: [], ativo: true },
];

// Simula a sessão logada da área do gestor (não há autenticação real ainda) — é o que
// permite telas como /gestor/usuarios saberem se quem está olhando é Administrador.
const MATRICULA_GESTOR_ATUAL = "10001";
export function gestorAtual(): Colaborador {
  return colaboradores.find((c) => c.matricula === MATRICULA_GESTOR_ATUAL)!;
}

// Mesma ideia do lado do colaborador (Carlos Menezes) — a área dele simula sempre esse
// mesmo usuário. Exportado aqui pra virar a fonte única desse número: as telas do
// colaborador usam pra achar o próprio cadastro, e /gestor/usuarios usa pra recusar
// excluir essa conta (excluir uma das duas identidades simuladas quebraria a área
// correspondente inteira, já que o `!` nas telas assume que ela sempre existe).
export const MATRICULA_COLABORADOR_ATUAL = "10298";

// As telas "gerais" do painel (dashboard, EPIs, Almoxarifado, Certificados, Observações,
// Mensagens, Auditoria, EPIs por Colaborador) são do time de gestão/segurança — não são
// do TI, do RH nem do Compras, cada um com sua própria tela restrita. Sem essa checagem,
// alguém logado como Compras ou RH conseguia digitar a URL de qualquer uma dessas telas
// direto e ter acesso completo, apesar do menu escondê-las.
export function temAcessoGeral(perfil: Perfil): boolean {
  return perfil === "Administrador" || perfil === "Gestor";
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
export type CategoriaAuditoria = "usuario" | "epi" | "certificado" | "observacao" | "compra";

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

// Ponte Almoxarifado → Compras: o Almoxarifado só enxerga e cria pedidos (não decide nada
// de compra em si); o Compras só vê a fila de pedidos e marca como comprado — cada um
// mexe numa ponta só. Guarda nome/CA como texto (não só o id) porque o pedido precisa
// continuar legível mesmo se o item for editado ou removido do catálogo depois.
export type StatusCompra = "pendente" | "comprado";

export interface SolicitacaoCompra {
  id: string;
  epiId: string;
  epiNome: string;
  ca: string;
  quantidade: number;
  data: string;
  dataComprado?: string;
  solicitadoPor: string;
  status: StatusCompra;
}

export const solicitacoesCompra: SolicitacaoCompra[] = [
  {
    id: "sc1",
    epiId: "3",
    epiNome: "Luvas isolantes",
    ca: "31402",
    quantidade: 20,
    data: "2026-07-20T10:00:00",
    dataComprado: "2026-07-25T15:30:00",
    solicitadoPor: "Ana Beatriz Silva",
    status: "comprado",
  },
];

export function addSolicitacaoCompra(input: {
  epiId: string;
  epiNome: string;
  ca: string;
  quantidade: number;
  solicitadoPor: string;
}): SolicitacaoCompra {
  const nova: SolicitacaoCompra = {
    id: Math.random().toString(36).slice(2),
    data: new Date().toISOString(),
    status: "pendente",
    ...input,
  };
  solicitacoesCompra.unshift(nova);
  return nova;
}

// Marcar como comprado já dá entrada no estoque do EPI correspondente — sem isso, o
// pedido "sumiria" no histórico de Compras e alguém ainda teria que lembrar de voltar no
// catálogo e somar a quantidade à mão.
export function marcarComprado(id: string) {
  const solicitacao = solicitacoesCompra.find((s) => s.id === id);
  if (!solicitacao || solicitacao.status === "comprado") return;
  solicitacao.status = "comprado";
  solicitacao.dataComprado = new Date().toISOString();
  const epi = epis.find((e) => e.id === solicitacao.epiId);
  if (epi) updateEpi({ ...epi, estoque: epi.estoque + solicitacao.quantidade });
}

export interface EntregaEpi {
  id: string;
  colaborador: string;
  matricula: string;
  cargo: string;
  setor: string;
  epi: string;
  tipoEpi: string;
  // Liga a entrega ao catálogo (epis[].id) — é o que permite dar baixa no estoque
  // certo quando a entrega é registrada. Opcional porque os registros históricos abaixo
  // vieram de antes dessa ligação existir e não têm como apontar pra um item específico
  // (alguns até têm nome abreviado, ex. "Capacete" em vez de "Capacete de segurança").
  epiId?: string;
  ca: string;
  dataEntrega: string;
  validade: string;
  status: EpiStatus;
}

export const entregas: EntregaEpi[] = [
  { id: "1", colaborador: "Carlos Menezes", matricula: "10298", cargo: "Eletricista", setor: "Manutenção", epi: "Capacete", tipoEpi: "Proteção da cabeça", ca: "12345", dataEntrega: "2025-08-15", validade: "2026-08-15", status: "proximo" },
  { id: "2", colaborador: "Carlos Menezes", matricula: "10298", cargo: "Eletricista", setor: "Manutenção", epi: "Luvas isolantes", tipoEpi: "Proteção das mãos", ca: "31402", dataEntrega: "2025-03-10", validade: "2026-03-20", status: "vencido" },
  { id: "3", colaborador: "Juliana Prado", matricula: "10455", cargo: "Operadora", setor: "Produção", epi: "Óculos", tipoEpi: "Proteção visual", ca: "22987", dataEntrega: "2025-11-02", validade: "2026-11-02", status: "vigente" },
  { id: "4", colaborador: "Rafael Souza", matricula: "10122", cargo: "Soldador", setor: "Produção", epi: "Máscara de solda", tipoEpi: "Proteção facial", ca: "50213", dataEntrega: "2025-05-18", validade: "2026-05-18", status: "vencido" },
  { id: "5", colaborador: "Rafael Souza", matricula: "10122", cargo: "Soldador", setor: "Produção", epi: "Botina", tipoEpi: "Proteção dos pés", ca: "40551", dataEntrega: "2026-01-10", validade: "2027-01-10", status: "vigente" },
  { id: "6", colaborador: "Marina Alves", matricula: "10390", cargo: "Ajudante geral", setor: "Logística", epi: "Colete refletivo", tipoEpi: "Proteção do corpo", ca: "60112", dataEntrega: "2025-09-01", validade: "2026-09-01", status: "proximo" },
];

export function addEntrega(input: Omit<EntregaEpi, "id">): EntregaEpi {
  const nova: EntregaEpi = { id: Math.random().toString(36).slice(2), ...input };
  entregas.unshift(nova);
  return nova;
}

export function updateEntrega(atualizada: EntregaEpi) {
  const idx = entregas.findIndex((e) => e.id === atualizada.id);
  if (idx !== -1) entregas[idx] = atualizada;
}

export function removeEntrega(id: string) {
  const idx = entregas.findIndex((e) => e.id === id);
  if (idx !== -1) entregas.splice(idx, 1);
}

// Saída em lote — pra quando um setor inteiro pede uma quantidade de EPI de uma vez (ex.:
// "RH pediu 20 botinas para o pessoal novo") em vez de uma entrega individual com CA e
// validade por pessoa. Não usa `entregas`/EntregaEpi de propósito: aqui não existe um
// colaborador recebendo um item específico com validade a controlar, só um responsável
// que assina pela retirada do lote inteiro — misturar isso na tela de Certificados poluiria
// o monitoramento de CA com registros que não têm data de validade nenhuma.
export interface SaidaEmLote {
  id: string;
  setor: string;
  epiId: string;
  epiNome: string;
  quantidade: number;
  responsavel: string;
  // Igual ao epiId acima: guarda o id de verdade (quando o responsável é alguém do
  // cadastro) além do nome em texto, pra não deixar essa ponta sem FK enquanto o resto
  // do dado tem.
  responsavelId?: string;
  data: string;
}

export const saidasEmLote: SaidaEmLote[] = [];

export function addSaidaEmLote(input: {
  setor: string;
  epiId: string;
  quantidade: number;
  responsavel: string;
  responsavelId?: string;
}): SaidaEmLote | null {
  const epi = epis.find((e) => e.id === input.epiId);
  if (!epi) return null;
  updateEpi({ ...epi, estoque: Math.max(0, epi.estoque - input.quantidade) });
  const nova: SaidaEmLote = {
    id: Math.random().toString(36).slice(2),
    data: new Date().toISOString(),
    setor: input.setor,
    epiId: input.epiId,
    epiNome: epi.nome,
    quantidade: input.quantidade,
    responsavel: input.responsavel,
    responsavelId: input.responsavelId,
  };
  saidasEmLote.unshift(nova);
  return nova;
}

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
  { id: "4", nome: "Fernando Costa", cargo: "Técnico de Manutenção", motivo: "Pendência de entrega no onboarding", prioridade: "media", acaoRotulo: "Agendar", acaoHref: "/gestor/certificados" },
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

// NotificationProvider (useNotifications.tsx) só lê `notificacoes` uma vez, no mount, pro
// próprio state do React — sem isso, uma notificação criada por uma tela (ex.: RH
// cadastrando alguém) mutava o array aqui embaixo mas o sininho no header nunca ficava
// sabendo, só apareceria depois de um F5. Esse pub/sub avisa o provider sempre que o
// array muda, pra ele re-sincronizar o próprio state a partir da fonte compartilhada —
// mesma ideia do `setLista([...epis])` que as telas fazem depois de mutar o catálogo,
// só que aqui quem mutou e quem precisa re-renderizar são componentes diferentes.
type OuvinteNotificacoes = () => void;
const ouvintesNotificacoes = new Set<OuvinteNotificacoes>();

export function inscreverNotificacoes(ouvinte: OuvinteNotificacoes): () => void {
  ouvintesNotificacoes.add(ouvinte);
  return () => ouvintesNotificacoes.delete(ouvinte);
}

function avisarOuvintesNotificacoes() {
  ouvintesNotificacoes.forEach((ouvinte) => ouvinte());
}

export function addNotificacao(input: { tipo: TipoNotificacao; titulo: string; descricao: string; prioridade: PrioridadeNotificacao; link?: string }) {
  const notif: Notificacao = {
    id: Math.random().toString(36).slice(2),
    dataHora: "Agora",
    lida: false,
    ...input,
  };
  notificacoes.unshift(notif);
  avisarOuvintesNotificacoes();
  return notif;
}

export function marcarNotificacaoLida(id: string) {
  const notif = notificacoes.find((n) => n.id === id);
  if (notif) notif.lida = true;
  avisarOuvintesNotificacoes();
}

export function marcarTodasNotificacoesLidas() {
  notificacoes.forEach((n) => { n.lida = true; });
  avisarOuvintesNotificacoes();
}

export function removerNotificacao(id: string) {
  const idx = notificacoes.findIndex((n) => n.id === id);
  if (idx !== -1) notificacoes.splice(idx, 1);
  avisarOuvintesNotificacoes();
}

export function limparNotificacoes() {
  notificacoes.splice(0, notificacoes.length);
  avisarOuvintesNotificacoes();
}

