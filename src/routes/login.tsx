import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Building2, Wifi, ShieldCheck, BarChart3, Boxes } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Iniciar sesión — TechTrack SaaS" }] }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("hernando@distribuidoral27.co");
  const [password, setPassword] = useState("demo1234");

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_top_right,white,transparent_50%),radial-gradient(circle_at_bottom_left,oklch(0.78_0.13_230),transparent_45%)]" />
        <div className="relative flex items-center gap-2.5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
            <Building2 className="size-5" />
          </div>
          <span className="text-lg font-semibold">TechTrack SaaS</span>
        </div>
        <div className="relative max-w-md">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">
            Control operativo para MiPymes
          </h1>
          <p className="mt-4 text-primary-foreground/80">
            Inventario, ventas y caja en una sola plataforma, incluso cuando falla internet.
          </p>
          <ul className="mt-8 space-y-3 text-sm">
            {[
              { icon: Wifi, t: "Opera sin conexión" },
              { icon: ShieldCheck, t: "Reduce descuadres" },
              { icon: Boxes, t: "Controla inventario" },
              { icon: BarChart3, t: "Toma decisiones con datos" },
            ].map((b) => (
              <li key={b.t} className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-lg bg-white/15">
                  <b.icon className="size-4" />
                </span>
                {b.t}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-primary-foreground/70">© 2025 TechTrack SaaS · Prototipo académico</p>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2.5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Building2 className="size-5" />
              </div>
              <span className="text-lg font-semibold">TechTrack SaaS</span>
            </div>
          </div>
          <Card className="border-border/80 p-8 shadow-[var(--shadow-card)]">
            <h2 className="text-xl font-semibold tracking-tight">Inicia sesión</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Accede al panel de Distribuidora La 27.
            </p>
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => { e.preventDefault(); navigate({ to: "/dashboard" }); }}
            >
              <div className="space-y-1.5">
                <Label htmlFor="email">Correo</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox defaultChecked /> Recordarme
                </label>
                <a className="text-sm font-medium text-primary hover:underline" href="#">¿Olvidaste tu contraseña?</a>
              </div>
              <Button type="submit" className="w-full">Iniciar sesión</Button>
              <p className="text-center text-sm text-muted-foreground">
                ¿Aún no tienes cuenta?{" "}
                <Link to="/soporte" className="font-medium text-primary hover:underline">Solicitar demo</Link>
              </p>
            </form>
          </Card>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Demo: cualquier credencial funciona — esta es una simulación.
          </p>
        </div>
      </div>
    </div>
  );
}
