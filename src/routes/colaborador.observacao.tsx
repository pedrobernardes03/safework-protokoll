import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CollaboratorShell } from "@/components/safework/CollaboratorShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { meusEpis } from "@/lib/safework-data";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/colaborador/observacao")({
  head: () => ({ meta: [{ title: "Registrar observação — SafeWork" }] }),
  component: ObservacaoPage,
});

const tipos = ["Danificado", "Desgastado", "Desconfortável", "Outro"] as const;

function ObservacaoPage() {
  const navigate = useNavigate();
  const [epiId, setEpiId] = useState(meusEpis[0].id);
  const [tipo, setTipo] = useState<string>("Danificado");
  const epi = meusEpis.find((e) => e.id === epiId) ?? meusEpis[0];

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
                  <epi.icon className="h-5 w-5" />
                </div>
                <Select value={epiId} onValueChange={setEpiId}>
                  <SelectTrigger id="epi" className="flex-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {meusEpis.map((e) => (
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
              <RadioGroup value={tipo} onValueChange={setTipo} className="grid grid-cols-2 gap-3">
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
