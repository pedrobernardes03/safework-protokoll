import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Check, MessageSquarePlus, History, ShieldCheck, MessageCircle } from "lucide-react";
import { CollaboratorShell } from "@/components/safework/CollaboratorShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { colaboradores, epis, iconeParaEpi, addLogAuditoria, MATRICULA_COLABORADOR_ATUAL, type Epi } from "@/lib/safework-data";
import { toast } from "sonner";

export const Route = createFileRoute("/colaborador/meus-epis")({
  head: () => ({ meta: [{ title: "Meus EPIs — SafeWork" }] }),
  component: MeusEpis,
});

function formatValidade(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function isVencido(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const dataValidade = new Date(y, m - 1, d);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return dataValidade.getTime() < hoje.getTime();
}

function MeusEpis() {
  const colaborador = colaboradores.find((c) => c.matricula === MATRICULA_COLABORADOR_ATUAL)!;
  // Só entra aqui o que está em `episObrigatorios` deste colaborador específico — é isso
  // que evita, por exemplo, pedir confirmação de colete para quem não usa colete.
  const meusEpis: Epi[] = epis.filter((e) => colaborador.episObrigatorios.includes(e.id));

  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const checkedCount = meusEpis.filter((e) => checked[e.id]).length;
  const allChecked = meusEpis.length > 0 && checkedCount === meusEpis.length;

  return (
    <CollaboratorShell>
      <div className="space-y-6">
        {/* Identificação do colaborador */}
        <section className="rounded-2xl border bg-card p-5 sm:p-6 shadow-[var(--shadow-card)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Colaborador
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight">{colaborador.nome}</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">{colaborador.cargo} · {colaborador.setor}</p>
            </div>
            <Badge className="shrink-0 bg-success text-success-foreground hover:bg-success">
              <ShieldCheck className="mr-1 h-3.5 w-3.5" /> Em dia
            </Badge>
          </div>
        </section>

        {/* EPIs Obrigatórios e Progresso */}
        <section>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight">EPIs obrigatórios</h2>
              <p className="text-sm text-muted-foreground">Toque em cada item para confirmar o uso.</p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-sm font-bold text-primary">
                {checkedCount}/{meusEpis.length}
              </span>
            </div>
          </div>

          <div className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${meusEpis.length ? (checkedCount / meusEpis.length) * 100 : 0}%` }}
            />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {meusEpis.map((epi) => {
              const isChecked = !!checked[epi.id];
              const vencido = isVencido(epi.validade);
              const Icon = iconeParaEpi(epi.categoria);
              return (
                <button
                  key={epi.id}
                  type="button"
                  disabled={submitted}
                  onClick={() => setChecked((c) => ({ ...c, [epi.id]: !c[epi.id] }))}
                  className={`group flex items-center gap-4 rounded-2xl border p-4.5 sm:p-5 text-left shadow-[var(--shadow-card)] transition-all select-none cursor-pointer w-full min-h-[92px] ${
                    submitted
                      ? "border-success/40 bg-success/5 cursor-default"
                      : isChecked
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : vencido
                          ? "border-border bg-card hover:border-danger/40"
                          : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <div
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl transition-colors ${
                      submitted
                        ? "bg-success text-success-foreground"
                        : isChecked
                          ? "bg-primary text-primary-foreground"
                          : vencido
                            ? "bg-danger/10 text-danger"
                            : "bg-primary/10 text-primary"
                    }`}
                  >
                    {submitted || isChecked ? <Check className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-semibold text-foreground">{epi.nome}</p>
                      {submitted ? (
                        <Badge variant="outline" className="shrink-0 border-success/40 bg-success/10 text-success">
                          Confirmado
                        </Badge>
                      ) : vencido ? (
                        <Badge variant="outline" className="shrink-0 border-danger/40 bg-danger/10 text-danger">
                          Vencido
                        </Badge>
                      ) : !isChecked ? (
                        <Badge variant="outline" className="shrink-0 border-danger/40 bg-danger/10 text-danger">
                          Obrigatório
                        </Badge>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      CA {epi.ca} · válido até {formatValidade(epi.validade)}
                    </p>
                  </div>
                  <div
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-all ${
                      submitted
                        ? "border-success bg-success text-success-foreground"
                        : isChecked
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30 bg-background"
                    }`}
                  >
                    {(submitted || isChecked) && <Check className="h-4 w-4 text-primary-foreground" />}
                  </div>
                </button>
              );
            })}
            {meusEpis.length === 0 && (
              <p className="col-span-full rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                Nenhum EPI obrigatório atribuído a você ainda. Fale com a segurança do trabalho.
              </p>
            )}
          </div>
        </section>

        {/* Área de conclusão */}
        <section className="rounded-2xl border bg-card p-5 sm:p-6 shadow-[var(--shadow-card)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {meusEpis.length === 0
                ? "Nenhum EPI para confirmar."
                : allChecked
                  ? "Todos os EPIs confirmados. Registro salvo automaticamente em seu histórico."
                  : `Faltam ${meusEpis.length - checkedCount} equipamento${meusEpis.length - checkedCount > 1 ? "s" : ""} para confirmar.`}
            </p>
            <Button
              size="lg"
              disabled={!allChecked || submitted || meusEpis.length === 0}
              className="w-full sm:w-auto shrink-0"
              onClick={() => {
                setSubmitted(true);
                addLogAuditoria({
                  acao: "Confirmou uso de EPIs obrigatórios",
                  alvo: colaborador.nome,
                  detalhe: meusEpis.map((e) => e.nome).join(", "),
                  categoria: "epi",
                  autor: colaborador.nome,
                  autorPerfil: colaborador.perfil,
                });
                toast.success("Confirmação registrada com sucesso.");
              }}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {submitted ? "Confirmado hoje" : "Concluir confirmação"}
            </Button>
          </div>
        </section>

        {/* Ações inferiores */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Button asChild variant="outline" size="lg" className="w-full justify-center">
            <Link to="/colaborador/observacao">
              <MessageSquarePlus className="mr-2 h-4 w-4" /> Registrar observação
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full justify-center">
            <Link to="/colaborador/historico">
              <History className="mr-2 h-4 w-4" /> Histórico
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full justify-center">
            <Link to="/colaborador/mensagens">
              <MessageCircle className="mr-2 h-4 w-4" /> Mensagens
            </Link>
          </Button>
        </div>
      </div>
    </CollaboratorShell>
  );
}
