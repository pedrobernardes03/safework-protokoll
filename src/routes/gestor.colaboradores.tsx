import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ListChecks, Search, Building2, Users, TriangleAlert } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  colaboradores,
  epis,
  iconeParaEpi,
  episDoSetor,
  setores as setoresCatalogo,
  updateColaborador,
  addLogAuditoria,
  gestorAtual,
  temAcessoGeral,
  type Colaborador,
} from "@/lib/safework-data";
import { AcessoRestrito } from "@/components/safework/AcessoRestrito";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/gestor/colaboradores")({
  head: () => ({ meta: [{ title: "EPIs por Colaborador — SafeWork" }] }),
  component: EpisPorColaboradorPage,
});

// Esta tela é só da Segurança do Trabalho: decidir o que cada colaborador é obrigado a
// usar. Cadastrar a pessoa em si (nome, CPF, matrícula, cargo, setor, e-mail) é trabalho
// do RH, em /gestor/rh — por isso não tem botão de "novo colaborador" nem edição desses
// dados aqui. Nível de acesso ao sistema é o TI, em /gestor/usuarios. Três telas, três
// donos, cada um mexendo só na própria parte.
function EpisPorColaboradorPage() {
  const [q, setQ] = useState("");
  const [setorAtivo, setSetorAtivo] = useState<string | null>(null);
  const [lista, setLista] = useState<Colaborador[]>(() => [...colaboradores]);
  const setoresOptions = useMemo(() => setoresCatalogo.filter((s) => s !== "Todos"), []);

  const setoresComContagem = useMemo(() => {
    const counts = new Map<string, number>(setoresOptions.map((s) => [s, 0]));
    lista.forEach((c) => counts.set(c.setor, (counts.get(c.setor) ?? 0) + 1));
    return Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [lista, setoresOptions]);

  if (!temAcessoGeral(gestorAtual().perfil)) {
    return <AcessoRestrito mensagem="Definir EPIs obrigatórios é uma decisão da Segurança do Trabalho." />;
  }

  const pendentes = lista.filter((c) => c.episObrigatorios.length === 0).length;

  // Quem ainda não tem nenhum EPI definido aparece primeiro — é literalmente o trabalho
  // que falta fazer nesta tela, então a lista já nasce ordenada pelo que precisa de
  // atenção, sem precisar de um filtro extra pra achar isso.
  const list = lista
    .filter(
      (c) =>
        (c.nome.toLowerCase().includes(q.toLowerCase()) || c.matricula.includes(q)) &&
        (!setorAtivo || c.setor === setorAtivo),
    )
    .sort((a, b) => {
      const pa = a.episObrigatorios.length === 0 ? 0 : 1;
      const pb = b.episObrigatorios.length === 0 ? 0 : 1;
      return pa - pb || a.nome.localeCompare(b.nome);
    });

  const handleSave = (updated: Colaborador) => {
    updateColaborador(updated);
    setLista([...colaboradores]);
    addLogAuditoria({ acao: "Definiu EPIs obrigatórios", alvo: updated.nome, categoria: "usuario" });
    toast.success(`EPIs de ${updated.nome} atualizados.`);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:justify-between">
        <div className="min-w-0">
          <h2 className="truncate text-2xl font-bold tracking-tight">EPIs por Colaborador</h2>
          <p className="text-sm text-muted-foreground">
            Defina o que cada um é obrigado a confirmar no checklist dele.{" "}
            <Link to="/gestor/rh" className="text-primary hover:underline">
              Cadastro de gente nova é com o RH.
            </Link>
          </p>
        </div>
        {pendentes > 0 && (
          <Badge variant="outline" className="shrink-0 gap-1.5 border-warning/40 bg-warning/10 text-warning-foreground">
            <TriangleAlert className="h-3 w-3" /> {pendentes} sem EPI definido
          </Badge>
        )}
      </div>

      {/* Setores — clicar filtra a lista abaixo para aquele setor específico */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <button
          type="button"
          onClick={() => setSetorAtivo(null)}
          className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-colors ${
            setorAtivo === null ? "border-primary bg-primary/5" : "hover:border-primary/30"
          }`}
        >
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Users className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Todos</p>
            <p className="text-xs text-muted-foreground">{lista.length} colaboradores</p>
          </div>
        </button>
        {setoresComContagem.map(([setor, count]) => (
          <button
            key={setor}
            type="button"
            onClick={() => setSetorAtivo(setor)}
            className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-colors ${
              setorAtivo === setor ? "border-primary bg-primary/5" : "hover:border-primary/30"
            }`}
          >
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{setor}</p>
              <p className="text-xs text-muted-foreground">{count} colaborador{count > 1 ? "es" : ""}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome ou matrícula..." className="pl-9" />
      </div>

      <div className="divide-y rounded-2xl border bg-card">
        {list.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">Nenhum colaborador encontrado.</p>
        )}
        {list.map((c) => {
          const semEpi = c.episObrigatorios.length === 0;
          return (
            <div key={c.id} className={`flex flex-wrap items-center gap-4 p-4 ${semEpi ? "bg-warning/5" : ""}`}>
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                  {c.nome.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-[160px] flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <p className="font-medium">{c.nome}</p>
                  {!c.ativo && <Badge variant="outline" className="shrink-0 border-danger/30 text-[10px] text-danger">Inativo</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">{c.cargo} · {c.setor}</p>
              </div>
              <div className="flex min-w-[200px] flex-1 flex-wrap items-center gap-1.5">
                {semEpi ? (
                  <span className="text-xs font-medium text-warning-foreground">Nenhum EPI definido ainda</span>
                ) : (
                  c.episObrigatorios.map((id) => {
                    const epi = epis.find((e) => e.id === id);
                    if (!epi) return null;
                    const Icon = iconeParaEpi(epi.categoria);
                    return (
                      <span key={id} className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">
                        <Icon className="h-3 w-3" /> {epi.nome}
                      </span>
                    );
                  })
                )}
              </div>
              <EpiChecklistDialog colaborador={c} onSave={handleSave} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EpiChecklistDialog({ colaborador, onSave }: { colaborador: Colaborador; onSave: (colaborador: Colaborador) => void }) {
  const [open, setOpen] = useState(false);
  const [episObrigatorios, setEpisObrigatorios] = useState<string[]>(colaborador.episObrigatorios);

  useEffect(() => {
    if (open) setEpisObrigatorios(colaborador.episObrigatorios);
  }, [open, colaborador.episObrigatorios]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="shrink-0">
          <ListChecks className="h-3.5 w-3.5" /> EPIs
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>EPIs de {colaborador.nome}</DialogTitle>
          <DialogDescription>{colaborador.cargo} · {colaborador.setor}</DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSave({ ...colaborador, episObrigatorios });
            setOpen(false);
          }}
        >
          <EpiChecklistField selecionados={episObrigatorios} onChange={setEpisObrigatorios} setorAtivo={colaborador.setor} />
          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// É aqui que a segurança "direciona" o que cada pessoa precisa usar — em vez de todo
// colaborador ver a mesma lista de EPIs, cada um só vê (e confirma) o que foi marcado
// para ele aqui, individualmente.
function EpiChecklistField({
  selecionados,
  onChange,
  setorAtivo,
}: {
  selecionados: string[];
  onChange: (ids: string[]) => void;
  setorAtivo: string;
}) {
  const toggle = (id: string) => {
    onChange(selecionados.includes(id) ? selecionados.filter((i) => i !== id) : [...selecionados, id]);
  };

  const sugeridos = setorAtivo ? episDoSetor(setorAtivo) : [];
  const faltamSugeridos = sugeridos.some((e) => !selecionados.includes(e.id));

  return (
    <div className="space-y-3">
      {/* Atalho com só os EPIs do setor da pessoa — poupa procurar na lista inteira. */}
      {sugeridos.length > 0 && (
        <div className="space-y-2 rounded-lg border border-primary/30 bg-primary/5 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-primary">EPIs do setor "{setorAtivo}"</p>
            {faltamSugeridos && (
              <button
                type="button"
                onClick={() => onChange([...new Set([...selecionados, ...sugeridos.map((e) => e.id)])])}
                className="shrink-0 text-xs font-medium text-primary hover:underline"
              >
                Marcar todos
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {sugeridos.map((epi) => {
              const Icon = iconeParaEpi(epi.categoria);
              const checked = selecionados.includes(epi.id);
              return (
                <button
                  type="button"
                  key={epi.id}
                  onClick={() => toggle(epi.id)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    checked ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:border-primary/40"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {epi.nome}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <Label>Todos os EPIs do catálogo</Label>
        <p className="text-xs text-muted-foreground">
          Só o que for marcado aqui aparece na tela "Meus EPIs" dele para confirmação.
        </p>
        <div className="grid max-h-48 grid-cols-1 gap-2 overflow-y-auto rounded-lg border p-3 sm:grid-cols-2">
          {epis.map((epi) => {
            const Icon = iconeParaEpi(epi.categoria);
            const checked = selecionados.includes(epi.id);
            return (
              <label
                key={epi.id}
                className={`flex cursor-pointer items-center gap-2 rounded-md p-1.5 text-sm transition-colors ${
                  checked ? "bg-primary/5" : "hover:bg-muted/60"
                }`}
              >
                <Checkbox checked={checked} onCheckedChange={() => toggle(epi.id)} />
                <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate">{epi.nome}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
