import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/safework/Logo";
import { Lock, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Entrar — SafeWork" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-primary lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,oklch(1_0_0/0.15),transparent_50%),radial-gradient(circle_at_80%_80%,oklch(1_0_0/0.1),transparent_50%)]" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-primary-foreground">
          <Logo textClassName="text-3xl font-extrabold text-primary-foreground" imageClassName="h-24 w-24 object-contain rounded-2xl bg-primary-foreground/15 p-2 backdrop-blur" />
          <div>
            <h1 className="text-4xl font-bold leading-tight">
              Segurança começa com informação em tempo real.
            </h1>
            <p className="mt-4 max-w-md text-primary-foreground/80">
              A plataforma completa para gestão de EPIs, controle de Certificados de Aprovação e
              comunicação com o time.
            </p>
          </div>
          <p className="text-sm text-primary-foreground/70">© 2026 SafeWork Corp.</p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Logo />
          </div>

          <h2 className="text-2xl font-bold tracking-tight">Bem-vindo de volta</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Acesse com seus dados corporativos.
          </p>

          <form
            className="mt-8 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              setLoading(true);
              setTimeout(() => navigate({ to: "/colaborador/meus-epis" }), 500);
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF ou Matrícula</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="cpf" required placeholder="000.000.000-00" className="pl-9" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="senha" required type="password" placeholder="••••••••" className="pl-9" />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>

            <div className="flex items-center justify-between text-sm">
              <Link to="/esqueci-senha" className="text-primary hover:underline">
                Primeiro acesso / Esqueci minha senha
              </Link>
            </div>

            <div className="rounded-lg border bg-muted/50 p-3 text-xs text-muted-foreground">
              <p className="font-medium text-foreground">Acesso rápido de demonstração:</p>
              <div className="mt-2 flex gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link to="/colaborador/meus-epis">Colaborador</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link to="/gestor">Gestor</Link>
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
