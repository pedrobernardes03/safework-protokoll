import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, ShieldAlert, UserCog, Lock, UserX, UserCheck, Trash2, Cpu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { colaboradores, gestorAtual, updateColaborador, removeColaborador, addLogAuditoria, type Colaborador, type Perfil } from "@/lib/safework-data";

export const Route = createFileRoute("/gestor/usuarios")({
  head: () => ({ meta: [{ title: "Usuários e Permissões — SafeWork" }] }),
  component: UsuariosPage,
});

const grupos: { perfil: Perfil; titulo: string; descricao: string; className: string }[] = [
  { perfil: "Administrador", titulo: "Administradores", descricao: "Acesso total, incluindo esta tela de permissões.", className: "bg-primary/10 text-primary" },
  { perfil: "Gestor", titulo: "Gestores", descricao: "Acesso ao painel de gestão: colaboradores, EPIs, certificados e observações.", className: "bg-warning/20 text-warning-foreground" },
  { perfil: "Colaborador", titulo: "Sem acesso ao painel", descricao: "Só enxergam a área do colaborador, no celular.", className: "bg-muted text-muted-foreground" },
];

function UsuariosPage() {
  const eu = gestorAtual();
  const [lista, setLista] = useState<Colaborador[]>(() => [...colaboradores]);

  if (eu.perfil !== "Administrador") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center">
        <Lock className="h-8 w-8 text-muted-foreground" />
        <p className="font-semibold">Acesso restrito</p>
        <p className="text-sm text-muted-foreground">
          Só administradores podem ver e alterar permissões de acesso ao painel.
        </p>
      </div>
    );
  }

  const handlePerfilChange = (colaborador: Colaborador, novoPerfil: Perfil) => {
    updateColaborador({ ...colaborador, perfil: novoPerfil });
    setLista([...colaboradores]);
    addLogAuditoria({
      acao: "Alterou nível de acesso",
      alvo: colaborador.nome,
      detalhe: `${colaborador.perfil} → ${novoPerfil}`,
      categoria: "usuario",
    });
    toast.success(`${colaborador.nome} agora é ${novoPerfil.toLowerCase()}.`);
  };

  const handleToggleAtivo = (colaborador: Colaborador) => {
    const novoAtivo = !colaborador.ativo;
    updateColaborador({ ...colaborador, ativo: novoAtivo });
    setLista([...colaboradores]);
    addLogAuditoria({
      acao: novoAtivo ? "Reativou colaborador" : "Desativou colaborador",
      alvo: colaborador.nome,
      categoria: "usuario",
    });
    toast.success(novoAtivo ? `${colaborador.nome} reativado.` : `${colaborador.nome} desativado — perde acesso, mas o histórico fica preservado.`);
  };

  const handleDelete = (colaborador: Colaborador) => {
    removeColaborador(colaborador.id);
    setLista([...colaboradores]);
    addLogAuditoria({ acao: "Excluiu colaborador", alvo: colaborador.nome, categoria: "usuario" });
    toast.success(`${colaborador.nome} excluído do sistema.`);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
        <Cpu className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div>
          <p className="text-sm font-semibold text-primary">Painel do setor de TI</p>
          <p className="text-xs text-muted-foreground">
            Só o TI controla quem acessa o quê no sistema: nível de acesso, desativação e exclusão de contas.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 rounded-2xl border bg-muted/30 p-4">
        {grupos.map((g) => (
          <div key={g.perfil} className="flex items-center gap-2.5">
            <span className={`grid h-8 w-8 place-items-center rounded-full ${g.className}`}>
              {g.perfil === "Administrador" ? <ShieldCheck className="h-4 w-4" /> : g.perfil === "Gestor" ? <UserCog className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
            </span>
            <div>
              <p className="text-lg font-bold leading-none">{lista.filter((c) => c.perfil === g.perfil).length}</p>
              <p className="text-xs text-muted-foreground">{g.titulo}</p>
            </div>
          </div>
        ))}
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-danger/10 text-danger">
            <UserX className="h-4 w-4" />
          </span>
          <div>
            <p className="text-lg font-bold leading-none">{lista.filter((c) => !c.ativo).length}</p>
            <p className="text-xs text-muted-foreground">Inativos</p>
          </div>
        </div>
      </div>

      {grupos.map((g) => {
        const pessoas = lista.filter((c) => c.perfil === g.perfil);
        if (pessoas.length === 0) return null;
        return (
          <div key={g.perfil} className="overflow-hidden rounded-2xl border">
            <div className={`px-5 py-3 ${g.className}`}>
              <p className="text-sm font-bold">{g.titulo}</p>
              <p className="text-xs opacity-80">{g.descricao}</p>
            </div>
            <div className="divide-y bg-card">
              {pessoas.map((c) => {
                const souEu = c.id === eu.id;
                return (
                  <div key={c.id} className={`flex flex-wrap items-center justify-between gap-3 px-5 py-3 ${!c.ativo ? "opacity-50" : ""}`}>
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                          {c.nome.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <p className="truncate text-sm font-semibold">{c.nome}</p>
                          {souEu && <Badge variant="secondary" className="shrink-0 text-[10px]">Você</Badge>}
                          {!c.ativo && <Badge variant="outline" className="shrink-0 border-danger/30 text-[10px] text-danger">Inativo</Badge>}
                        </div>
                        <p className="truncate text-xs text-muted-foreground">{c.cargo} · {c.setor}</p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Select
                        value={c.perfil}
                        onValueChange={(v) => handlePerfilChange(c, v as Perfil)}
                        disabled={souEu}
                      >
                        <SelectTrigger className="w-[150px]" title={souEu ? "Você não pode alterar seu próprio nível de acesso" : undefined}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Colaborador">Colaborador</SelectItem>
                          <SelectItem value="Gestor">Gestor</SelectItem>
                          <SelectItem value="Administrador">Administrador</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={souEu}
                        title={souEu ? "Você não pode desativar sua própria conta" : c.ativo ? "Desativar" : "Reativar"}
                        onClick={() => handleToggleAtivo(c)}
                      >
                        {c.ativo ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost" disabled={souEu} className="text-danger hover:text-danger" title={souEu ? "Você não pode excluir sua própria conta" : "Excluir"}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir {c.nome}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Isso remove o cadastro por completo, incluindo o acesso ao painel ou ao app. Se for só uma
                              saída temporária ou desligamento recente, considere desativar em vez de excluir — assim o
                              histórico de EPIs e observações continua rastreável.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(c)} className="bg-danger text-danger-foreground hover:bg-danger/90">
                              Excluir definitivamente
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
