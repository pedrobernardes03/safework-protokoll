import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CollaboratorShell } from "@/components/safework/CollaboratorShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { colaboradores, epis, iconeParaEpi, addObservacao, addMensagem, addNotificacao, addLogAuditoria, type Observacao } from "@/lib/safework-data";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/colaborador/observacao")({
  head: () => ({ meta: [{ title: "Registrar observação — SafeWork" }] }),
  component: ObservacaoPage,
});

const tipos = ["Danificado", "Desgastado", "Desconfortável", "Outro"] as const;

// A área do colaborador simula sempre o mesmo usuário (Carlos Menezes), igual ao resto
// das telas de colaborador — usado tanto para criar a observação quanto a mensagem.
const MATRICULA = "10298";
const colaboradorAtual = colaboradores.find((c) => c.matricula === MATRICULA)!;
const COLABORADOR = { nome: colaboradorAtual.nome, matricula: colaboradorAtual.matricula, cargo: colaboradorAtual.cargo };

// A observação pode ser sobre qualquer equipamento do catálogo — não só os que são
// obrigatórios para este colaborador — mas os dele aparecem primeiro na lista por
// conveniência, já que é o caso mais comum.
const equipamentos = [...epis].sort((a, b) => {
  const aMeu = colaboradorAtual.episObrigatorios.includes(a.id);
  const bMeu = colaboradorAtual.episObrigatorios.includes(b.id);
  if (aMeu !== bMeu) return aMeu ? -1 : 1;
  return a.nome.localeCompare(b.nome);
});

function ObservacaoPage() {
  const navigate = useNavigate();
  const [epiId, setEpiId] = useState(equipamentos[0].id);
  const [tipo, setTipo] = useState<Observacao["tipo"]>("Danificado");
  const [descricao, setDescricao] = useState("");
  const epi = equipamentos.find((e) => e.id === epiId) ?? equipamentos[0];
  const EpiIcon = iconeParaEpi(epi.categoria);

  return (
    <CollaboratorShell back={{ to: "/colaborador/meus-epis", label: "Meus EPIs" }}>
      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="text-lg">Registrar observação sobre EPI</CardTitle>
          <CardDescription>
            Reporte problemas em seus equipamentos para que o gestor tome providências.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-7"
            onSubmit={(e) => {
              e.preventDefault();
              const obs = addObservacao({
                colaborador: COLABORADOR.nome,
                matricula: COLABORADOR.matricula,
                cargo: COLABORADOR.cargo,
                epi: epi.nome,
                tipo,
                descricao,
              });
              // Além de virar um registro em Observações, cai como mensagem de verdade
              // na conversa do gestor — não é só um retalho isolado no board de ocorrências.
              addMensagem(
                COLABORADOR.matricula,
                COLABORADOR.nome,
                COLABORADOR.cargo,
                "colaborador",
                `Nova observação registrada (${obs.id} · ${epi.nome} · ${tipo}): ${descricao}`,
              );
              addNotificacao({
                tipo: "nova_observacao",
                titulo: `Nova Ocorrência (${obs.id})`,
                descricao: `${COLABORADOR.nome} relatou: ${epi.nome} — ${tipo}. ${descricao}`,
                prioridade: "media",
                link: "/gestor/observacoes",
              });
              addLogAuditoria({
                acao: "Registrou observação",
                alvo: `${obs.id} — ${epi.nome}`,
                detalhe: tipo,
                categoria: "observacao",
                autor: COLABORADOR.nome,
                autorPerfil: "Colaborador",
              });
              toast.success("Observação enviada! O gestor foi notificado.");
              setTimeout(() => navigate({ to: "/colaborador/meus-epis" }), 600);
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="epi" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Qual equipamento?
              </Label>
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <EpiIcon className="h-5 w-5" />
                </div>
                <Select value={epiId} onValueChange={setEpiId}>
                  <SelectTrigger id="epi" className="flex-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {equipamentos.map((e) => (
                      <SelectItem key={e.id} value={e.id}>{e.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                O que aconteceu?
              </Label>
              <RadioGroup value={tipo} onValueChange={(v) => setTipo(v as Observacao["tipo"])} className="grid grid-cols-2 gap-3">
                {tipos.map((t) => (
                  <label
                    key={t}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition ${
                      tipo === t ? "border-primary bg-primary/5" : "hover:bg-accent/50"
                    }`}
                  >
                    <RadioGroupItem value={t} />
                    {t}
                  </label>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Detalhes
              </Label>
              <Textarea
                id="desc"
                required
                rows={5}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o problema com o máximo de detalhes possível..."
              />
            </div>

            <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => navigate({ to: "/colaborador/meus-epis" })}>
                Cancelar
              </Button>
              <Button type="submit">Enviar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </CollaboratorShell>
  );
}
