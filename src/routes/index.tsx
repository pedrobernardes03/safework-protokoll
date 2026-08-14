import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/safework/Logo";
import {
  ShieldCheck,
  HardHat,
  ClipboardList,
  BarChart3,
  ArrowRight,
  User,
  Clock,
  Users,
  Bell,
  Home,
  Settings,
  LogOut,
  Factory,
  Building2,
  Box,
  Truck,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50 text-slate-800 font-sans">
      {/* Top Navbar */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Logo to="/" imageClassName="h-10 w-10 rounded-xl object-contain" textClassName="text-2xl font-extrabold tracking-tight text-slate-900" />

        {/* Center Nav Links */}
        <nav className="hidden items-center gap-8 md:flex text-sm font-semibold text-slate-700">
          <Link to="/" className="group flex flex-col items-center gap-1 text-slate-900">
            <span>Recursos</span>
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          </Link>
          <a href="#solucoes" className="group flex flex-col items-center gap-1 hover:text-slate-900 transition-colors">
            <span>Soluções</span>
            <span className="h-1.5 w-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <a href="#planos" className="group flex flex-col items-center gap-1 hover:text-slate-900 transition-colors">
            <span>Planos</span>
            <span className="h-1.5 w-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <a href="#sobre" className="group flex flex-col items-center gap-1 hover:text-slate-900 transition-colors">
            <span>Sobre nós</span>
            <span className="h-1.5 w-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" className="font-semibold text-slate-700 hover:text-slate-900">
            <Link to="/login">Entrar</Link>
          </Button>
          <Button asChild className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 py-2.5 shadow-md shadow-primary/20">
            <Link to="/gestor" className="flex items-center gap-2">
              Área do Gestor <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-8">
        <section className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column Content */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-slate-800">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Segurança do trabalho <span className="font-bold text-primary">conectada</span>
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem]">
              Gestão inteligente de EPIs para equipes que valorizam{" "}
              <span className="text-primary font-extrabold">segurança.</span>
            </h1>

            <p className="text-base text-slate-600 sm:text-lg leading-relaxed max-w-lg">
              Centralize o controle de Equipamentos de Proteção Individual, monitore Certificados de
              Aprovação e mantenha uma comunicação direta entre colaboradores e gestores.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button asChild size="lg" className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-6 text-base shadow-lg shadow-primary/25">
                <Link to="/login" className="flex items-center gap-2">
                  Acessar plataforma <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl border-primary/40 text-primary hover:bg-primary/10 font-semibold px-6 py-6 text-base">
                <Link to="/colaborador/meus-epis" className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" /> Área do colaborador
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column: Platform Preview Mockup Graphic */}
          <div className="lg:col-span-7 relative">
            {/* Background Glow */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-primary/15 via-primary/5 to-transparent blur-2xl -z-10" />

            {/* Main Window Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-md p-3 sm:p-4 shadow-2xl flex gap-3">
              {/* Mini Left Sidebar */}
              <div className="hidden sm:flex flex-col items-center justify-between py-3 px-2 border-r border-slate-100 bg-slate-50/60 rounded-2xl w-14 shrink-0">
                <div className="space-y-4 flex flex-col items-center">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 grid place-items-center text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="space-y-3 pt-2">
                    <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground grid place-items-center shadow-sm">
                      <Home className="h-4 w-4" />
                    </div>
                    <div className="h-9 w-9 rounded-xl text-slate-400 hover:text-slate-600 grid place-items-center">
                      <ClipboardList className="h-4 w-4" />
                    </div>
                    <div className="h-9 w-9 rounded-xl text-slate-400 hover:text-slate-600 grid place-items-center">
                      <BarChart3 className="h-4 w-4" />
                    </div>
                    <div className="h-9 w-9 rounded-xl text-slate-400 hover:text-slate-600 grid place-items-center">
                      <Shield className="h-4 w-4" />
                    </div>
                    <div className="h-9 w-9 rounded-xl text-slate-400 hover:text-slate-600 grid place-items-center">
                      <Users className="h-4 w-4" />
                    </div>
                    <div className="h-9 w-9 rounded-xl text-slate-400 hover:text-slate-600 grid place-items-center">
                      <Settings className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <div className="h-9 w-9 rounded-xl text-slate-400 grid place-items-center">
                  <LogOut className="h-4 w-4" />
                </div>
              </div>

              {/* Mockup Main View */}
              <div className="flex-1 space-y-4 p-2 sm:p-3">
                {/* Mockup Top Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">Painel do gestor</h3>
                  <div className="flex items-center gap-3">
                    <div className="relative text-slate-500">
                      <Bell className="h-4 w-4" />
                      <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <div className="h-8 w-8 rounded-full bg-slate-200 grid place-items-center text-xs font-semibold text-slate-700">
                      JS
                    </div>
                  </div>
                </div>

                {/* Top Stats Grid (4 Metrics) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                  <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 grid place-items-center">
                        <HardHat className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-slate-700">Meus EPIs</p>
                        <p className="text-lg font-extrabold text-slate-900 leading-tight">12</p>
                        <p className="text-[10px] text-slate-400">Itens ativos</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 grid place-items-center">
                        <ClipboardList className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-slate-700">Observações</p>
                        <p className="text-lg font-extrabold text-slate-900 leading-tight">3</p>
                        <p className="text-[10px] text-slate-400">Pendências</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-emerald-50 text-primary grid place-items-center">
                        <BarChart3 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-slate-700">CAs monitorados</p>
                        <p className="text-lg font-extrabold text-slate-900 leading-tight">28</p>
                        <p className="text-[10px] text-slate-400">Próximos do vencimento</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 grid place-items-center">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-slate-700">Conformidade</p>
                        <p className="text-lg font-extrabold text-slate-900 leading-tight">98%</p>
                        <p className="text-[10px] text-slate-400">Média da equipe</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom 2 Grid Cards */}
                <div className="grid sm:grid-cols-2 gap-3 pt-1">
                  {/* Card 1: Próximos vencimentos */}
                  <div className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm space-y-3">
                    <h4 className="text-xs font-bold text-slate-900">Próximos vencimentos</h4>
                    <div className="space-y-2.5 text-xs">
                      <div>
                        <div className="flex justify-between font-semibold text-slate-800 text-[11px]">
                          <span>Capacete de segurança</span>
                          <span className="text-slate-500 font-normal">12 dias</span>
                        </div>
                        <p className="text-[10px] text-slate-400">CA 12345</p>
                        <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-primary rounded-full w-3/4" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold text-slate-800 text-[11px]">
                          <span>Óculos de proteção</span>
                          <span className="text-slate-500 font-normal">18 dias</span>
                        </div>
                        <p className="text-[10px] text-slate-400">CA 54321</p>
                        <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-primary rounded-full w-1/2" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold text-slate-800 text-[11px]">
                          <span>Luva de proteção</span>
                          <span className="text-slate-500 font-normal">25 dias</span>
                        </div>
                        <p className="text-[10px] text-slate-400">CA 67890</p>
                        <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-primary rounded-full w-1/3" />
                        </div>
                      </div>
                    </div>
                    <button className="text-[11px] font-semibold text-primary hover:underline">Ver todos</button>
                  </div>

                  {/* Card 2: Comunicação recente */}
                  <div className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm space-y-3">
                    <h4 className="text-xs font-bold text-slate-900">Comunicação recente</h4>
                    <div className="space-y-3 text-xs">
                      <div className="flex items-start gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-slate-100 grid place-items-center text-slate-600 shrink-0 mt-0.5">
                          <User className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-[11px]">Novo comunicado de segurança</p>
                          <p className="text-[10px] text-slate-400">Hoje, 08:30</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-slate-100 grid place-items-center text-slate-600 shrink-0 mt-0.5">
                          <User className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-[11px]">Atualização de CA</p>
                          <p className="text-[10px] text-slate-400">Ontem, 16:45</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-slate-100 grid place-items-center text-slate-600 shrink-0 mt-0.5">
                          <User className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-[11px]">Treinamento agendado</p>
                          <p className="text-[10px] text-slate-400">21/05/2024</p>
                        </div>
                      </div>
                    </div>
                    <button className="text-[11px] font-semibold text-primary hover:underline">Ver todas</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights Row Container (4 Pillars) */}
        <section className="mt-20 rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            {/* Item 1 */}
            <div className="flex items-start gap-4 pt-4 sm:pt-0 sm:px-4 first:pl-0">
              <div className="h-12 w-12 rounded-full bg-primary/10 grid place-items-center text-primary shrink-0 border border-primary/20">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Tudo em um só lugar</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  EPIs, CAs e comunicação centralizados.
                </p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-start gap-4 pt-4 sm:pt-0 sm:px-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 grid place-items-center text-primary shrink-0 border border-primary/20">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Tempo é segurança</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Reduza retrabalho e ganhe agilidade.
                </p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-start gap-4 pt-4 sm:pt-0 sm:px-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 grid place-items-center text-primary shrink-0 border border-primary/20">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Conformidade garantida</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Auditorias e documentos sempre em dia.
                </p>
              </div>
            </div>

            {/* Item 4 */}
            <div className="flex items-start gap-4 pt-4 sm:pt-0 sm:px-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 grid place-items-center text-primary shrink-0 border border-primary/20">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Equipes conectadas</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Mais transparência entre colaboradores e gestores.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Client Trust Section */}
        <section className="mt-20 text-center space-y-8">
          <p className="text-sm font-semibold text-slate-600">
            Mais de <span className="font-bold text-primary">1.200</span> empresas já confiam
          </p>

          <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-14 opacity-75 grayscale hover:grayscale-0 transition-all">
            <div className="flex items-center gap-2 font-bold text-slate-700 text-lg tracking-wider">
              <Building2 className="h-6 w-6 text-slate-500" />
              <span>Construtec</span>
            </div>

            <div className="flex items-center gap-2 font-extrabold text-slate-700 text-lg tracking-wide">
              <Factory className="h-6 w-6 text-slate-500" />
              <span>INDÚSTRIA FORTE</span>
            </div>

            <div className="flex items-center gap-2 font-bold text-slate-700 text-lg tracking-widest">
              <Box className="h-6 w-6 text-slate-500" />
              <span>ENGEPRO</span>
            </div>

            <div className="flex items-center gap-2 font-bold text-slate-700 text-lg tracking-tight">
              <Truck className="h-6 w-6 text-slate-500" />
              <span>LogSolution</span>
            </div>

            <div className="flex items-center gap-2 font-extrabold text-slate-700 text-lg tracking-wider">
              <Shield className="h-6 w-6 text-slate-500" />
              <span>MAIS SAFETY</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
