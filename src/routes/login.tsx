import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/safework/Logo";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/lib/supabase";
import { definirGestorAtual, rotaInicialPorPerfil, type Perfil } from "@/lib/safework-data";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Entrar — SafeWork" }],
  }),
  component: LoginPage,
});

// Login único pra colaborador e gestão: a credencial é checada contra a tabela
// `colaboradores` no Supabase (matrícula ou CPF + senha), e o perfil de quem logou decide
// pra onde ir — RH cai em /gestor/rh, Compras em /gestor/compras, um Colaborador comum cai
// no app do celular, etc. Duas consultas separadas (matrícula, depois CPF) em vez de um
// único filtro `.or()` com o valor digitado direto na string, que ficaria vulnerável a
// injeção de filtro do PostgREST se alguém digitasse vírgula/parênteses no campo.
async function buscarColaborador(identificador: string, senha: string) {
  const porMatricula = await supabase
    .from("colaboradores")
    .select("nome, matricula, perfil, ativo")
    .eq("matricula", identificador)
    .eq("senha", senha)
    .maybeSingle();

  if (porMatricula.data || porMatricula.error) return porMatricula;

  return supabase
    .from("colaboradores")
    .select("nome, matricula, perfil, ativo")
    .eq("cpf", identificador)
    .eq("senha", senha)
    .maybeSingle();
}

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [identificador, setIdentificador] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await buscarColaborador(identificador.trim(), senha);

    if (error) {
      toast.error("Não deu pra conectar ao banco agora. Tenta de novo em instantes.");
      setLoading(false);
      return;
    }
    if (!data) {
      toast.error("CPF/matrícula ou senha incorretos.");
      setLoading(false);
      return;
    }
    if (!data.ativo) {
      toast.error("Essa conta está desativada. Fale com o TI.");
      setLoading(false);
      return;
    }

    definirGestorAtual(data.matricula);
    toast.success(`Bem-vindo(a), ${data.nome.split(" ")[0]}!`);
    navigate({ to: rotaInicialPorPerfil[data.perfil as Perfil] ?? "/colaborador/meus-epis" });
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Painel do vídeo em background cinematográfico full-bleed */}
      <div className="relative min-h-[260px] sm:min-h-[320px] lg:min-h-screen w-full overflow-hidden bg-slate-950">
        <video
          src="/login-showcase.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
        />
        {/* Camada escura sobre o vídeo para contraste, equilíbrio e integração visual */}
        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute left-6 top-6 sm:left-8 sm:top-8 z-10 drop-shadow-md">
          <Logo
            to="/"
            imageClassName="h-10 w-10 object-contain"
            textClassName="text-lg font-bold text-white"
          />
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 [animation-fill-mode:both]">
            <h2 className="text-2xl font-bold tracking-tight">Bem-vindo de volta</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Acesse com seus dados corporativos.
            </p>
          </div>

          <form
            className="mt-8 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:120ms] [animation-fill-mode:both]"
            onSubmit={handleSubmit}
          >
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF ou Matrícula</Label>
              <div className="group relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  id="cpf"
                  required
                  placeholder="000.000.000-00"
                  className="pl-9"
                  value={identificador}
                  onChange={(e) => setIdentificador(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <div className="group relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  id="senha"
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-9 pr-9"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <Checkbox id="lembrar" />
                Lembrar acesso
              </label>
              <Link to="/esqueci-senha" className="text-primary hover:underline">
                Esqueci minha senha
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner className="border-primary-foreground/25 border-t-primary-foreground" /> Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span>SafeWork v2.4.0</span>
            <span className="text-border">·</span>
            <button
              type="button"
              className="transition-colors hover:text-foreground hover:underline"
              onClick={() => toast.info("Nossa equipe de suporte responde em até 2 horas úteis.")}
            >
              Suporte
            </button>
            <span className="text-border">·</span>
            <button
              type="button"
              className="transition-colors hover:text-foreground hover:underline"
              onClick={() => toast.info("Política de Privacidade disponível em breve.")}
            >
              Política de Privacidade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
