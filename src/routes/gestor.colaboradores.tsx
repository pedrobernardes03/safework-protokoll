import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Pencil, Trash2, Search, Building2, Users, HardHat } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CreatableSelect } from "@/components/safework/CreatableSelect";
import {
  colaboradores,
  epis,
  iconeParaEpi,
  setores as setoresCatalogo,
  addSetor,
  addColaborador,
  updateColaborador,
  removeColaborador,
  type Colaborador,
  type Perfil,
} from "@/lib/safework-data";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

// EPIs de um setor: os marcados para aquele setor especificamente, mais os de uso
// universal ("Todos", ex.: capacete). Usado tanto para sugerir ao escolher o setor
// quanto para o card de atalho no checklist.
function episDoSetor(setor: string) {
  return epis.filter((e) => e.setores.includes(setor) || e.setores.includes("Todos"));
}

export const Route = createFileRoute("/gestor/colaboradores")({
  head: () => ({ meta: [{ title: "Colaboradores — SafeWork" }] }),
  component: ColaboradoresPage,
});

function ColaboradoresPage() {
  const [q, setQ] = useState("");
  const [setorAtivo, setSetorAtivo] = useState<string | null>(null);
  const [lista, setLista] = useState<Colaborador[]>(() => [...colaboradores]);
  // "Todos" é um setor só para EPIs de uso universal — não faz sentido como setor de
  // uma pessoa, então fica de fora das opções aqui.
  const [setoresOptions, setSetoresOptions] = useState<string[]>(() => setoresCatalogo.filter((s) => s !== "Todos"));

  const setoresComContagem = useMemo(() => {
    const counts = new Map<string, number>(setoresOptions.map((s) => [s, 0]));
    lista.forEach((c) => counts.set(c.setor, (counts.get(c.setor) ?? 0) + 1));
    return Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [lista, setoresOptions]);

  const handleCreateSetor = (novo: string) => {
    addSetor(novo);
    setSetoresOptions(setoresCatalogo.filter((s) => s !== "Todos"));
    toast.success(`Setor "${novo}" criado.`);
  };

  const list = lista.filter(
    (c) =>
      (c.nome.toLowerCase().includes(q.toLowerCase()) || c.matricula.includes(q)) &&
      (!setorAtivo || c.setor === setorAtivo),
  );

  // Sempre mutando o array compartilhado — é o que faz um EPI atribuído aqui aparecer
  // de verdade na tela "Meus EPIs" do colaborador, e não só nesta tabela.
  const handleSave = (updated: Colaborador) => {
    updateColaborador(updated);
    setLista([...colaboradores]);
    toast.success("Colaborador atualizado com sucesso.");
  };

  const handleAdd = (novo: Omit<Colaborador, "id">) => {
    addColaborador(novo);
    setLista([...colaboradores]);
    toast.success("Colaborador cadastrado com sucesso.");
  };

  const handleDelete = (id: string) => {
    removeColaborador(id);
    setLista([...colaboradores]);
    toast.success("Colaborador removido.");
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <div className="min-w-0">
          <h2 className="truncate text-2xl font-bold tracking-tight">Colaboradores</h2>
          <p className="text-sm text-muted-foreground">Cadastre e gerencie sua equipe.</p>
        </div>
        <NewColaboradorDialog onAdd={handleAdd} setores={setoresOptions} onCreateSetor={handleCreateSetor} />
      </div>

      {/* Setores — clicar filtra a tabela abaixo para aquele setor específico */}
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
                  <TableHead>Cargo</TableHead>
                  <TableHead>Setor</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>EPIs obrigatórios</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                            {c.nome.split(" ").slice(0,2).map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="truncate font-medium">{c.nome}</p>
                            {!c.ativo && (
                              <Badge variant="outline" className="shrink-0 border-danger/30 text-[10px] text-danger">Inativo</Badge>
                            )}
                          </div>
                          <p className="truncate text-xs text-muted-foreground">{c.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{c.matricula}</TableCell>
                    <TableCell>{c.cargo}</TableCell>
                    <TableCell>{c.setor}</TableCell>
                    <TableCell>
                      <Badge variant={c.perfil === "Gestor" ? "default" : "secondary"}>
                        {c.perfil}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {c.episObrigatorios.length > 0 ? (
                        <Badge variant="outline" className="gap-1 border-primary/30 text-primary">
                          <HardHat className="h-3 w-3" /> {c.episObrigatorios.length}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">Nenhum definido</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <EditColaboradorDialog colaborador={c} onSave={handleSave} setores={setoresOptions} onCreateSetor={handleCreateSetor} />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-danger hover:text-danger"
                        onClick={() => handleDelete(c.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function NewColaboradorDialog({
  onAdd,
  setores,
  onCreateSetor,
}: {
  onAdd: (colaborador: Omit<Colaborador, "id">) => void;
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
  const [perfil, setPerfil] = useState<Perfil>("Colaborador");
  const [episObrigatorios, setEpisObrigatorios] = useState<string[]>([]);

  const reset = () => {
    setNome("");
    setCpf("");
    setMatricula("");
    setCargo("");
    setSetor("");
    setEmail("");
    setPerfil("Colaborador");
    setEpisObrigatorios([]);
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
            const novo: Omit<Colaborador, "id"> = {
              nome,
              cpf,
              matricula,
              cargo,
              setor,
              email,
              perfil,
              episObrigatorios,
              ativo: true,
            };
            onAdd(novo);
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
            <CreatableSelect
              label="Setor"
              value={setor}
              onChange={(v) => {
                setSetor(v);
                setEpisObrigatorios(episDoSetor(v).map((e) => e.id));
              }}
              options={setores}
              onCreate={onCreateSetor}
              required
            />
          </div>
          <Field label="E-mail corporativo"><Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
          <Field label="Perfil de acesso">
            <Select value={perfil} onValueChange={(v) => setPerfil(v as Perfil)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Colaborador">Colaborador</SelectItem>
                <SelectItem value="Gestor">Gestor</SelectItem>
                <SelectItem value="Administrador">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <EpiChecklistField selecionados={episObrigatorios} onChange={setEpisObrigatorios} setorAtivo={setor} />
          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit">Cadastrar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditColaboradorDialog({
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
  const [perfil, setPerfil] = useState(colaborador.perfil);
  const [episObrigatorios, setEpisObrigatorios] = useState<string[]>(colaborador.episObrigatorios);

  useEffect(() => {
    if (open) {
      setNome(colaborador.nome);
      setCpf(colaborador.cpf);
      setMatricula(colaborador.matricula);
      setCargo(colaborador.cargo);
      setSetor(colaborador.setor);
      setEmail(colaborador.email);
      setPerfil(colaborador.perfil);
      setEpisObrigatorios(colaborador.episObrigatorios);
    }
  }, [open, colaborador]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar colaborador</DialogTitle>
          <DialogDescription>Atualize as informações de {colaborador.nome}.</DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSave({
              ...colaborador,
              nome,
              cpf,
              matricula,
              cargo,
              setor,
              email,
              perfil,
              episObrigatorios,
            });
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
            <CreatableSelect
              label="Setor"
              value={setor}
              onChange={(v) => {
                setSetor(v);
                setEpisObrigatorios(episDoSetor(v).map((e) => e.id));
              }}
              options={setores}
              onCreate={onCreateSetor}
              required
            />
          </div>
          <Field label="E-mail corporativo"><Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
          <Field label="Perfil de acesso">
            <Select value={perfil} onValueChange={(v) => setPerfil(v as Perfil)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Colaborador">Colaborador</SelectItem>
                <SelectItem value="Gestor">Gestor</SelectItem>
                <SelectItem value="Administrador">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <EpiChecklistField selecionados={episObrigatorios} onChange={setEpisObrigatorios} setorAtivo={setor} />
          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit">Salvar alterações</Button>
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
      {/* Atalho com só os EPIs do setor escolhido — poupa procurar na lista inteira. */}
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
