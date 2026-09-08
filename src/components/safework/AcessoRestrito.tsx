import { Lock } from "lucide-react";

// Mesmo cartão usado em Compras/RH/Usuários e Permissões — extraído aqui pra não repetir
// o mesmo JSX em toda tela que ganhou guarda de perfil.
export function AcessoRestrito({ mensagem }: { mensagem: string }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center">
      <Lock className="h-8 w-8 text-muted-foreground" />
      <p className="font-semibold">Acesso restrito</p>
      <p className="text-sm text-muted-foreground">{mensagem}</p>
    </div>
  );
}
