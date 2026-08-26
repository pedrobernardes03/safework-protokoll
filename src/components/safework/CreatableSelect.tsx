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

// Mesma ideia do CreatableSelect, mas para quando mais de um valor pode se aplicar ao
// mesmo tempo (ex.: um EPI usado por vários setores) — pílulas clicáveis em vez de um
// dropdown de valor único.
export function CreatableMultiSelect({
  label,
  values,
  onChange,
  options,
  onCreate,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  options: string[];
  onCreate: (novo: string) => void;
}) {
  const [criando, setCriando] = useState(false);
  const [novo, setNovo] = useState("");

  const toggle = (opt: string) => {
    onChange(values.includes(opt) ? values.filter((v) => v !== opt) : [...values, opt]);
  };

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex flex-wrap items-center gap-1.5 rounded-md border p-2">
        {options.map((opt) => {
          const active = values.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                active ? "border-primary bg-primary text-primary-foreground" : "text-muted-foreground hover:border-primary/40"
              }`}
            >
              {opt}
            </button>
          );
        })}
        {criando ? (
          <span className="inline-flex items-center gap-1">
            <Input
              autoFocus
              value={novo}
              onChange={(e) => setNovo(e.target.value)}
              placeholder="Novo..."
              className="h-7 w-28 px-2 text-xs"
              onKeyDown={(e) => {
                if (e.key === "Escape") { setCriando(false); setNovo(""); }
                if (e.key === "Enter") {
                  e.preventDefault();
                  const v = novo.trim();
                  if (!v) return;
                  onCreate(v);
                  onChange(values.includes(v) ? values : [...values, v]);
                  setNovo("");
                  setCriando(false);
                }
              }}
            />
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="h-7 w-7"
              title="Cancelar"
              onClick={() => { setCriando(false); setNovo(""); }}
            >
              ×
            </Button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setCriando(true)}
            className="flex items-center gap-1 rounded-full border border-dashed px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/5"
          >
            <Plus className="h-3 w-3" /> Novo
          </button>
        )}
      </div>
      {values.length === 0 && <p className="text-xs text-danger">Selecione ao menos um.</p>}
    </div>
  );
}
