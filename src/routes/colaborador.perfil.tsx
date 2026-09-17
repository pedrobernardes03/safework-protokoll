import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  User,
  Mail,
  Phone,
  Hash,
  Briefcase,
  Building2,
  Calendar,
  ShieldCheck,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  MessageSquarePlus,
} from "lucide-react";
import { CollaboratorShell } from "@/components/safework/CollaboratorShell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  colaboradores,
  epis,
  entregas,
  iconeParaEpi,
  MATRICULA_COLABORADOR_ATUAL,
  type Epi,
  type EpiStatus,
} from "@/lib/safework-data";
import { toast } from "sonner";

export const Route = createFileRoute("/colaborador/perfil")({
  head: () => ({ meta: [{ title: "Meu Perfil — SafeWork" }] }),
  component: ColaboradorPerfilPage,
});

function formatValidade(iso: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function calcularStatusEpi(epi: Epi, entregasColaborador: typeof entregas): EpiStatus {
  // Se houver registro formal em `entregas` com status específico para esse equipamento, prioriza
  const entregaCorrespondente = entregasColaborador.find(
    (ent) => ent.ca === epi.ca || ent.epi.toLowerCase().includes(epi.nome.toLowerCase().slice(0, 5)),
  );
  if (entregaCorrespondente?.status) {
    return entregaCorrespondente.status;
  }

  // Cálculo por data de validade do catálogo
  if (!epi.validade) return "vigente";
  const [y, m, d] = epi.validade.split("-").map(Number);
  const dataValidade = new Date(y, m - 1, d);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const diffDias = Math.ceil((dataValidade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDias < 0) return "vencido";
  if (diffDias <= 60) return "proximo";
  return "vigente";
}

function ColaboradorPerfilPage() {
  const navigate = useNavigate();
  const colaborador = colaboradores.find((c) => c.matricula === MATRICULA_COLABORADOR_ATUAL)!;
  const iniciais = colaborador ? colaborador.nome.split(" ").slice(0, 2).map((n) => n[0]).join("") : "";

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    toast.success("Sessão encerrada com sucesso.");
    navigate({ to: "/login" });
  };

  // Dados complementares para visualização do perfil corporativo
  const dadosPessoais = {
    nomeCompleto: colaborador?.nome ?? "Carlos Menezes",
    cpf: colaborador?.cpf ?? "234.567.890-11",
    email: colaborador?.email ?? "carlos.m@empresa.com",
    telefone: "(11) 98452-1984",
  };

  const dadosProfissionais = {
    matricula: colaborador?.matricula ?? MATRICULA_COLABORADOR_ATUAL,
    cargo: colaborador?.cargo ?? "Eletricista",
    setor: colaborador?.setor ?? "Manutenção",
    departamento: "Manutenção e Operações Industriais",
    dataAdmissao: "18/09/2023",
    perfilAcesso: "Colaborador Operacional",
  };

  // EPIs atribuídos ao colaborador
  const meusEpis: Epi[] = epis.filter((e) => colaborador?.episObrigatorios.includes(e.id));
  const entregasDoColaborador = entregas.filter((ent) => ent.matricula === MATRICULA_COLABORADOR_ATUAL);

  // Mapeamento com status individual
  const episComStatus = meusEpis.map((epi) => {
    const status = calcularStatusEpi(epi, entregasDoColaborador);
    return { ...epi, statusCalculado: status };
  });

  const episProximosOuVencidos = episComStatus.filter(
    (e) => e.statusCalculado === "proximo" || e.statusCalculado === "vencido",
  );
  const episEmUsoRegular = episComStatus.filter((e) => e.statusCalculado === "vigente");

  return (
    <CollaboratorShell back={{ to: "/colaborador/meus-epis", label: "Meus EPIs" }}>
      <div className="space-y-6">
        {/* Cartão de Identificação Principal */}
        <section className="rounded-2xl border bg-card p-6 shadow-[var(--shadow-card)]">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 sm:gap-5">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 ring-2 ring-primary/20">
                <AvatarFallback className="bg-primary/10 text-xl sm:text-2xl font-bold text-primary">
                  {iniciais}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{dadosPessoais.nomeCompleto}</h1>
                <p className="text-sm text-muted-foreground">
                  {dadosProfissionais.cargo} · {dadosProfissionais.setor}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/15 border-primary/20">
                    <ShieldCheck className="mr-1 h-3.5 w-3.5" /> Colaborador
                  </Badge>
                  <Badge variant="outline" className="text-success border-success/30 bg-success/10">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> Cadastro Ativo
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="outline"
                className="text-danger hover:bg-danger/10 hover:text-danger hover:border-danger/40 transition-colors cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" /> Sair da conta
              </Button>
            </div>
          </div>
        </section>

        {/* Grade de Informações: Dados Pessoais e Dados Profissionais */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Dados Pessoais */}
          <section className="rounded-2xl border bg-card p-6 shadow-[var(--shadow-card)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 border-b pb-4">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </div>
                <h2 className="text-base font-semibold">Dados Pessoais</h2>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Nome completo
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground shrink-0" />
                    {dadosPessoais.nomeCompleto}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    CPF
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground flex items-center gap-2 font-mono">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    {dadosPessoais.cpf}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    E-mail
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    {dadosPessoais.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Telefone
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    {dadosPessoais.telefone}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Dados Profissionais */}
          <section className="rounded-2xl border bg-card p-6 shadow-[var(--shadow-card)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 border-b pb-4">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Briefcase className="h-4 w-4" />
                </div>
                <h2 className="text-base font-semibold">Dados Profissionais</h2>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Matrícula
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground flex items-center gap-2 font-mono">
                    <Hash className="h-4 w-4 text-muted-foreground shrink-0" />
                    {dadosProfissionais.matricula}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Cargo
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
                    {dadosProfissionais.cargo}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Setor
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                    {dadosProfissionais.setor}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Data de admissão
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                    {dadosProfissionais.dataAdmissao}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Seção: EPIs (Equipamentos de Proteção Individual) */}
        <section className="rounded-2xl border bg-card p-6 shadow-[var(--shadow-card)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-semibold">Equipamentos de Proteção Individual (EPIs)</h2>
                <p className="text-xs text-muted-foreground">Equipamentos vinculados ao seu setor e atividade</p>
              </div>
            </div>
            <Badge variant="outline" className="self-start sm:self-auto font-mono text-xs">
              {meusEpis.length} atribuído{meusEpis.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          {/* Cards de Métricas de EPI */}
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border bg-accent/30 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                EPIs Atribuídos
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                {meusEpis.length}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">Obrigatórios para sua função</p>
            </div>

            <div className="rounded-xl border bg-accent/30 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                EPIs em Uso Regular
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-success">
                {episEmUsoRegular.length}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">Vigentes e em conformidade</p>
            </div>

            <div className="rounded-xl border bg-accent/30 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Próximos da Troca
              </p>
              <p className={`mt-1 text-2xl font-bold tracking-tight ${episProximosOuVencidos.length > 0 ? "text-warning-foreground" : "text-foreground"}`}>
                {episProximosOuVencidos.length}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {episProximosOuVencidos.length > 0 ? "Requerem atenção ou substituição" : "Nenhuma troca pendente"}
              </p>
            </div>
          </div>

          {/* Alerta de EPIs próximos da troca ou vencidos se houver */}
          {episProximosOuVencidos.length > 0 ? (
            <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-warning/40 bg-warning/10 p-4 text-warning-foreground">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-warning" />
                <div>
                  <p className="text-sm font-semibold">Atenção para substituição de EPI</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Você possui {episProximosOuVencidos.length} equipamento{episProximosOuVencidos.length > 1 ? "s" : ""} próximo do vencimento ou para troca periódica. Caso necessário, reporte ao gestor.
                  </p>
                </div>
              </div>
              <Button asChild size="sm" variant="outline" className="shrink-0 border-warning/40 hover:bg-warning/20">
                <Link to="/colaborador/observacao">
                  <MessageSquarePlus className="mr-1.5 h-3.5 w-3.5" /> Registrar observação
                </Link>
              </Button>
            </div>
          ) : (
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-success/30 bg-success/10 p-3 text-success">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <p className="text-xs font-medium">Todos os seus EPIs obrigatórios estão em dia e com validade regular.</p>
            </div>
          )}

          {/* Listagem detalhada dos EPIs em uso */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">Detalhamento dos EPIs em uso</h3>
            {meusEpis.length === 0 ? (
              <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                Nenhum EPI atribuído no momento.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {episComStatus.map((epi) => {
                  const Icon = iconeParaEpi(epi.categoria);
                  const isProximo = epi.statusCalculado === "proximo";
                  const isVencido = epi.statusCalculado === "vencido";

                  return (
                    <div
                      key={epi.id}
                      className={`flex items-center gap-4 rounded-xl border p-4 shadow-[var(--shadow-card)] transition-colors ${
                        isVencido
                          ? "border-danger/40 bg-danger/5"
                          : isProximo
                            ? "border-warning/40 bg-warning/5"
                            : "border-border bg-card"
                      }`}
                    >
                      <div
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
                          isVencido
                            ? "bg-danger/10 text-danger"
                            : isProximo
                              ? "bg-warning/20 text-warning-foreground"
                              : "bg-primary/10 text-primary"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate font-semibold text-sm text-foreground">{epi.nome}</p>
                          {isVencido ? (
                            <Badge variant="outline" className="shrink-0 border-danger/40 bg-danger/10 text-danger text-[11px]">
                              Vencido
                            </Badge>
                          ) : isProximo ? (
                            <Badge variant="outline" className="shrink-0 border-warning/40 bg-warning/20 text-warning-foreground text-[11px]">
                              <Clock className="mr-1 h-3 w-3" /> Próximo da troca
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="shrink-0 border-success/30 bg-success/10 text-success text-[11px]">
                              Em uso
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          CA {epi.ca} · Válido até {formatValidade(epi.validade)}
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground/80">
                          {epi.categoria}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </CollaboratorShell>
  );
}
