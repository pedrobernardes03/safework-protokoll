import { useState } from "react";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Select com opção de criar um novo valor na hora — evita ter que sair do formulário
// pra cadastrar uma categoria, função ou setor que ainda não existe na lista.
export function CreatableSelect({
  label,
  value,
  onChange,
  options,
  onCreate,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  onCreate: (novo: string) => void;
  required?: boolean;
}) {
  const [criando, setCriando] = useState(false);
  const [novo, setNovo] = useState("");

  if (criando) {
    return (
      <div className="space-y-1.5">
        <Label>{label}</Label>
        <div className="flex gap-2">
          <Input
            autoFocus
            value={novo}
            onChange={(e) => setNovo(e.target.value)}
            placeholder={`Nova ${label.toLowerCase()}`}
            onKeyDown={(e) => {
              if (e.key === "Escape") { setCriando(false); setNovo(""); }
            }}
          />
          <Button
            type="button"
            size="icon"
            variant="outline"
            title="Cancelar"
            onClick={() => { setCriando(false); setNovo(""); }}
          >
            ×
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={!novo.trim()}
            onClick={() => {
              const v = novo.trim();
              if (!v) return;
              onCreate(v);
              onChange(v);
              setNovo("");
              setCriando(false);
            }}
          >
            Adicionar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Select
        required={required}
        value={value}
        onValueChange={(v) => {
          if (v === "__nova__") {
            setCriando(true);
            return;
          }
          onChange(v);
        }}
      >
        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>{o}</SelectItem>
          ))}
          <SelectItem value="__nova__" className="font-semibold text-primary">
            <span className="flex items-center gap-1.5"><Plus className="h-3.5 w-3.5" /> Criar nova...</span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
