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
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { gestorAtual } from "@/lib/safework-data";
import { toast } from "sonner";

export const Route = createFileRoute("/gestor/perfil")({
  head: () => ({ meta: [{ title: "Meu Perfil — SafeWork" }] }),
  component: PerfilPage,
});

function PerfilPage() {
  const navigate = useNavigate();
  const gestor = gestorAtual();
  const iniciais = gestor.nome.split(" ").slice(0, 2).map((n) => n[0]).join("");

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    toast.success("Sessão encerrada com sucesso.");
    navigate({ to: "/login" });
  };

  // Dados complementares do perfil corporativo
  const perfilInfo = {
    nomeCompleto: gestor.nome,
    email: gestor.email,
    telefone: "(11) 98765-4321",
    matricula: gestor.matricula,
    cargo: gestor.cargo,
    setor: gestor.setor,
    departamento: "Segurança e Saúde Ocupacional (SSO)",
    dataAdmissao: "15/03/2023",
    nivelAcesso: gestor.perfil,
  };

  return (
    <div className="space-y-6">
      {/* Botão Voltar */}
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground hover:text-foreground">
          <Link to="/gestor">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Voltar para Visão Geral
          </Link>
        </Button>
      </div>

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
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{perfilInfo.nomeCompleto}</h1>
              <p className="text-sm text-muted-foreground">{perfilInfo.cargo} · {perfilInfo.setor}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/15 border-primary/20">
                  <ShieldCheck className="mr-1 h-3.5 w-3.5" /> Nível: {perfilInfo.nivelAcesso}
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
              className="text-danger hover:bg-danger/10 hover:text-danger hover:border-danger/40 transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" /> Sair da conta
            </Button>
          </div>
        </div>
      </section>

      {/* Grade de Informações: Pessoais e Profissionais */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Informações Pessoais */}
        <section className="rounded-2xl border bg-card p-6 shadow-[var(--shadow-card)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b pb-4">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <User className="h-4 w-4" />
              </div>
              <h2 className="text-base font-semibold">Informações Pessoais</h2>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Nome completo
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {perfilInfo.nomeCompleto}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  E-mail corporativo
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {perfilInfo.email}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Telefone
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {perfilInfo.telefone}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Matrícula
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground flex items-center gap-2 font-mono">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  {perfilInfo.matricula}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Informações Profissionais */}
        <section className="rounded-2xl border bg-card p-6 shadow-[var(--shadow-card)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b pb-4">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <Briefcase className="h-4 w-4" />
              </div>
              <h2 className="text-base font-semibold">Informações Profissionais</h2>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Cargo
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  {perfilInfo.cargo}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Setor
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  {perfilInfo.setor}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Departamento
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  {perfilInfo.departamento}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Data de admissão
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {perfilInfo.dataAdmissao}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Nível de acesso
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  {perfilInfo.nivelAcesso} (Controle de Acesso Total)
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
