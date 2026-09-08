import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Search, Building2, Users, Lock, IdCard, UserX, UserCheck, UserRoundX } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CreatableSelect } from "@/components/safework/CreatableSelect";
import {
  colaboradores,
  gestorAtual,
  episDoSetor,
  setores as setoresCatalogo,
  addSetor,
  addColaborador,
  updateColaborador,
  addLogAuditoria,
  addNotificacao,
  type Colaborador,
} from "@/lib/safework-data";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/gestor/rh")({
  head: () => ({ meta: [{ title: "Colaboradores — SafeWork" }] }),
  component: RHPage,
});

// Esta tela é só do RH: cadastrar quem trabalha na empresa (nome, CPF, matrícula, cargo,
// setor, e-mail) e desativar/reativar por desligamento. O que cada um é obrigado a usar de
// EPI fica com a Segurança do Trabalho (/gestor/colaboradores) e o NÍVEL DE ACESSO ao
// sistema (Administrador/Gestor/etc.) fica exclusivamente com o TI (/gestor/usuarios) —
// por isso não existe campo de perfil nem de EPI aqui, só o botão de ativar/desativar.
// Ao cadastrar alguém, o setor já pré-marca um ponto de partida razoável de EPIs por trás
// das cortinas (mesma lista usada como sugestão na tela da Segurança do Trabalho); o RH
// não precisa nem ver isso — só evita que todo mundo novo caia com "nenhum EPI definido".
function RHPage() {
  const eu = gestorAtual();
  const [q, setQ] = useState("");
  const [setorAtivo, setSetorAtivo] = useState<string | null>(null);
  const [visualizacao, setVisualizacao] = useState<"ativos" | "desativados">("ativos");
  const [lista, setLista] = useState<Colaborador[]>(() => [...colaboradores]);
  const [setoresOptions, setSetoresOptions] = useState<string[]>(() => setoresCatalogo.filter((s) => s !== "Todos"));

  // Desativado sai da lista principal e vai pra própria aba — junto com quem ainda tá na
  // ativa, ia acumulando gente que não trabalha mais aqui misturada com quem trabalha.
  const ativos = lista.filter((c) => c.ativo);
  const desativados = lista.filter((c) => !c.ativo);

  const setoresComContagem = useMemo(() => {
    const counts = new Map<string, number>(setoresOptions.map((s) => [s, 0]));
    ativos.forEach((c) => counts.set(c.setor, (counts.get(c.setor) ?? 0) + 1));
    return Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lista, setoresOptions]);

  if (eu.perfil !== "RH" && eu.perfil !== "Administrador") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center">
        <Lock className="h-8 w-8 text-muted-foreground" />
        <p className="font-semibold">Acesso restrito</p>
        <p className="text-sm text-muted-foreground">Só o RH pode ver e alterar o cadastro da equipe.</p>
      </div>
    );
  }

  const handleCreateSetor = (novo: string) => {
    addSetor(novo);
    setSetoresOptions(setoresCatalogo.filter((s) => s !== "Todos"));
    toast.success(`Setor "${novo}" criado.`);
  };

  const base = visualizacao === "ativos" ? ativos : desativados;
  const list = base.filter(
    (c) =>
      (c.nome.toLowerCase().includes(q.toLowerCase()) || c.matricula.includes(q)) &&
      (!setorAtivo || c.setor === setorAtivo),
  );

  const handleSave = (updated: Colaborador) => {
    updateColaborador(updated);
    setLista([...colaboradores]);
    addLogAuditoria({ acao: "Editou cadastro de colaborador", alvo: updated.nome, categoria: "usuario" });
    toast.success("Cadastro atualizado com sucesso.");
  };

  const handleAdd = (novo: { nome: string; cpf: string; matricula: string; cargo: string; setor: string; email: string }) => {
    const criado = addColaborador({
      ...novo,
      perfil: "Colaborador",
      // Ponto de partida sugerido pelo setor — a Segurança do Trabalho revisa e ajusta em
      // /gestor/colaboradores, não é decisão do RH.
      episObrigatorios: episDoSetor(novo.setor).map((e) => e.id),
      ativo: true,
    });
    setLista([...colaboradores]);
    addLogAuditoria({ acao: "Cadastrou colaborador", alvo: criado.nome, categoria: "usuario" });
    // Avisa a Segurança do Trabalho que tem gente nova esperando checklist de EPI — sem
    // isso, só descobririam entrando na tela e vendo o badge "sem EPI definido".
    addNotificacao({
      tipo: "novo_colaborador",
      titulo: "Novo colaborador cadastrado",
      descricao: `${criado.nome} foi adicionado à equipe de ${criado.setor}. Falta definir os EPIs obrigatórios.`,
      prioridade: "baixa",
      link: "/gestor/colaboradores",
    });
    toast.success(`${criado.nome} cadastrado(a) com sucesso.`);
  };

  const handleToggleAtivo = (c: Colaborador) => {
    const novoAtivo = !c.ativo;
    updateColaborador({ ...c, ativo: novoAtivo });
    setLista([...colaboradores]);
    addLogAuditoria({ acao: novoAtivo ? "Reativou colaborador" : "Desativou colaborador", alvo: c.nome, categoria: "usuario" });
    toast.success(novoAtivo ? `${c.nome} reativado(a).` : `${c.nome} desativado(a) — moveu para a aba Desativados.`);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-start gap-3 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4">
        <IdCard className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />
        <div>
          <p className="text-sm font-semibold text-violet-600">Painel de RH</p>
          <p className="text-xs text-muted-foreground">
            Cadastro da equipe — nome, CPF, matrícula, cargo, setor e e-mail. Nível de acesso ao sistema é com o TI;
            EPIs obrigatórios são com a Segurança do Trabalho.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <div className="min-w-0">
          <h2 className="truncate text-2xl font-bold tracking-tight">Colaboradores</h2>
          <p className="text-sm text-muted-foreground">Cadastre e mantenha os dados da equipe em dia.</p>
        </div>
        {visualizacao === "ativos" && (
          <NovoColaboradorDialog onAdd={handleAdd} setores={setoresOptions} onCreateSetor={handleCreateSetor} />
        )}
      </div>

      {/* Duas abas de verdade, não um filtro a mais — desativado some da lista principal
          e só aparece aqui, pra não ficar acumulando junto com quem trabalha ativamente. */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => { setVisualizacao("ativos"); setSetorAtivo(null); }}
          className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
            visualizacao === "ativos" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
          }`}
        >
          Ativos ({ativos.length})
        </button>
        <button
          type="button"
          onClick={() => { setVisualizacao("desativados"); setSetorAtivo(null); }}
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
            visualizacao === "desativados" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <UserRoundX className="h-3.5 w-3.5" /> Desativados ({desativados.length})
        </button>
      </div>

      {/* Setores — clicar filtra a tabela abaixo para aquele setor específico. Só faz
          sentido pra lista de ativos; desativados costuma ser pouca gente, não precisa
          desse recorte. */}
      {visualizacao === "ativos" && (
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
              <p className="text-xs text-muted-foreground">{ativos.length} colaboradores</p>
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
      )}

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por nome ou matrícula..."
                className="pl-9"
              />
            </div>
            {setorAtivo && (
              <Badge variant="outline" className="gap-1.5 border-primary/30 text-primary">
                {setorAtivo}
                <button type="button" onClick={() => setSetorAtivo(null)} className="font-bold" aria-label="Limpar filtro de setor">
                  ×
                </button>
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>Matrícula</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Setor</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                      {visualizacao === "desativados" ? "Nenhum colaborador desativado." : "Nenhum colaborador encontrado."}
                    </TableCell>
                  </TableRow>
                )}
                {list.map((c) => {
                  const souEu = c.id === eu.id;
                  return (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                            {c.nome.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="truncate font-medium">{c.nome}</p>
                            {souEu && <Badge variant="secondary" className="shrink-0 text-[10px]">Você</Badge>}
                          </div>
                          <p className="truncate text-xs text-muted-foreground">{c.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{c.matricula}</TableCell>
                    <TableCell className="font-mono text-sm">{c.cpf}</TableCell>
                    <TableCell>{c.cargo}</TableCell>
                    <TableCell>{c.setor}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <EditarColaboradorDialog colaborador={c} onSave={handleSave} setores={setoresOptions} onCreateSetor={handleCreateSetor} />
                        <Button
                          size="icon"
                          variant="ghost"
                          disabled={souEu}
                          title={souEu ? "Você não pode desativar sua própria conta" : c.ativo ? "Desativar" : "Reativar"}
                          onClick={() => handleToggleAtivo(c)}
                        >
                          {c.ativo ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface DadosCadastrais {
  nome: string;
  cpf: string;
  matricula: string;
  cargo: string;
  setor: string;
  email: string;
}

function NovoColaboradorDialog({
  onAdd,
  setores,
  onCreateSetor,
}: {
  onAdd: (dados: DadosCadastrais) => void;
  setores: string[];
  onCreateSetor: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [matricula, setMatricula] = useState("");
  const [cargo, setCargo] = useState("");
  const [setor, setSetor] = useState("");
  const [email, setEmail] = useState("");

  const reset = () => {
    setNome("");
    setCpf("");
    setMatricula("");
    setCargo("");
    setSetor("");
    setEmail("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <Button className="shrink-0"><Plus className="mr-1 h-4 w-4" /> Novo colaborador</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Cadastrar colaborador</DialogTitle>
          <DialogDescription>Preencha os dados para adicionar um novo colaborador.</DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            onAdd({ nome, cpf, matricula, cargo, setor, email });
            setOpen(false);
            reset();
          }}
        >
          <Field label="Nome completo"><Input required value={nome} onChange={(e) => setNome(e.target.value)} /></Field>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="CPF"><Input required placeholder="000.000.000-00" value={cpf} onChange={(e) => setCpf(e.target.value)} /></Field>
            <Field label="Matrícula"><Input required value={matricula} onChange={(e) => setMatricula(e.target.value)} /></Field>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Cargo"><Input required value={cargo} onChange={(e) => setCargo(e.target.value)} /></Field>
            <CreatableSelect label="Setor" value={setor} onChange={setSetor} options={setores} onCreate={onCreateSetor} required />
          </div>
          <Field label="E-mail corporativo"><Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit">Cadastrar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditarColaboradorDialog({
  colaborador,
  onSave,
  setores,
  onCreateSetor,
}: {
  colaborador: Colaborador;
  onSave: (colaborador: Colaborador) => void;
  setores: string[];
  onCreateSetor: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState(colaborador.nome);
  const [cpf, setCpf] = useState(colaborador.cpf);
  const [matricula, setMatricula] = useState(colaborador.matricula);
  const [cargo, setCargo] = useState(colaborador.cargo);
  const [setor, setSetor] = useState(colaborador.setor);
  const [email, setEmail] = useState(colaborador.email);

  useEffect(() => {
    if (open) {
      setNome(colaborador.nome);
      setCpf(colaborador.cpf);
      setMatricula(colaborador.matricula);
      setCargo(colaborador.cargo);
      setSetor(colaborador.setor);
      setEmail(colaborador.email);
    }
  }, [open, colaborador]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar cadastro</DialogTitle>
          <DialogDescription>Atualize as informações de {colaborador.nome}.</DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSave({ ...colaborador, nome, cpf, matricula, cargo, setor, email });
            setOpen(false);
          }}
        >
          <Field label="Nome completo"><Input required value={nome} onChange={(e) => setNome(e.target.value)} /></Field>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="CPF"><Input required value={cpf} onChange={(e) => setCpf(e.target.value)} /></Field>
            <Field label="Matrícula"><Input required value={matricula} onChange={(e) => setMatricula(e.target.value)} /></Field>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Cargo"><Input required value={cargo} onChange={(e) => setCargo(e.target.value)} /></Field>
            <CreatableSelect label="Setor" value={setor} onChange={setSetor} options={setores} onCreate={onCreateSetor} required />
          </div>
          <Field label="E-mail corporativo"><Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit">Salvar alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
