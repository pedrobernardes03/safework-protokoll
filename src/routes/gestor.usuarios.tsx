import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, ShieldAlert, UserCog, Lock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { colaboradores, gestorAtual, updateColaborador, type Colaborador, type Perfil } from "@/lib/safework-data";

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
    const atualizado = { ...colaborador, perfil: novoPerfil };
    updateColaborador(atualizado);
    setLista([...colaboradores]);
    toast.success(`${colaborador.nome} agora é ${novoPerfil.toLowerCase()}.`);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
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
                  <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                          {c.nome.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold">{c.nome}</p>
                          {souEu && <Badge variant="secondary" className="shrink-0 text-[10px]">Você</Badge>}
                        </div>
                        <p className="truncate text-xs text-muted-foreground">{c.cargo} · {c.setor}</p>
                      </div>
                    </div>
                    <Select
                      value={c.perfil}
                      onValueChange={(v) => handlePerfilChange(c, v as Perfil)}
                      disabled={souEu}
                    >
                      <SelectTrigger className="w-[160px] shrink-0" title={souEu ? "Você não pode alterar seu próprio nível de acesso" : undefined}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Colaborador">Colaborador</SelectItem>
                        <SelectItem value="Gestor">Gestor</SelectItem>
                        <SelectItem value="Administrador">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
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
