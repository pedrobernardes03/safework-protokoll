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
};
