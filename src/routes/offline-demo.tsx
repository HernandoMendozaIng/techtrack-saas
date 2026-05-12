import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/app/AppLayout";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { WifiOff, ShoppingBag, Boxes, Wallet, RefreshCw, ArrowRight, ShieldCheck, GraduationCap } from "lucide-react";
import { StatusBadge } from "@/components/app/StatusBadge";

export const Route = createFileRoute("/offline-demo")({
  component: OfflineDemo,
  head: () => ({ meta: [{ title: "Modo Offline-First — TechTrack SaaS" }] }),
});

function OfflineDemo() {
  const { isOnline, setOnline } = useStore();

  return (
    <AppLayout>
      <PageHeader
        title="Modo Offline-First"
        subtitle="Tu negocio no se detiene cuando falla internet."
        actions={
          <>
            <Button variant={isOnline ? "default" : "outline"} onClick={() => setOnline(!isOnline)}>
              <WifiOff className="mr-2 size-4" />
              {isOnline ? "Simular sin conexión" : "Restablecer conexión"}
            </Button>
            <Button asChild variant="outline"><Link to="/dashboard">Volver al dashboard</Link></Button>
          </>
        }
      />

      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-card to-accent/10">
        <CardContent className="grid gap-6 p-8 lg:grid-cols-2 lg:items-center">
          <div>
            <StatusBadge tone="primary">Diferenciador clave</StatusBadge>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Sigue operando, aunque internet no.
            </h2>
            <p className="mt-3 text-muted-foreground">
              TechTrack SaaS guarda localmente cada movimiento y los sincroniza automáticamente con la nube cuando vuelve la conexión. Diseñado para MiPymes que no pueden detener su operación.
            </p>
          </div>
          <div className="grid grid-cols-5 items-center gap-3 text-center text-xs font-medium">
            <FlowStep icon={WifiOff} label="Sin conexión" tone="warning" />
            <ArrowRight className="mx-auto size-5 text-muted-foreground" />
            <FlowStep icon={Boxes} label="Registro local" tone="info" />
            <ArrowRight className="mx-auto size-5 text-muted-foreground" />
            <FlowStep icon={RefreshCw} label="Sinc. automática" tone="success" />
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>¿Qué puedes seguir haciendo?</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              {[
                { i: ShoppingBag, t: "Registrar ventas en el punto de venta" },
                { i: Boxes, t: "Ajustar inventario y stock" },
                { i: Wallet, t: "Cerrar caja y registrar movimientos" },
                { i: ShieldCheck, t: "Consultar datos guardados localmente" },
              ].map((x) => (
                <li key={x.t} className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-success/10 text-success"><x.i className="size-4" /></span>
                  {x.t}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>¿Qué se sincroniza después?</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              {["Ventas registradas durante el modo offline", "Productos creados o editados", "Movimientos y cierres de caja", "Ajustes de inventario y mermas"].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-1 size-2 rounded-full bg-primary" /> {t}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-dashed">
        <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <GraduationCap className="size-5" />
          </div>
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Acerca del prototipo.</strong>{" "}
            Este prototipo fue diseñado como evidencia práctica de una iniciativa de Emprendimiento de Base Tecnológica.
            TechTrack SaaS responde a la validación de una problemática real en MiPymes: descuadres financieros,
            pérdida de inventario y falta de trazabilidad operativa.
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}

function FlowStep({ icon: Icon, label, tone }: { icon: React.ComponentType<{ className?: string }>; label: string; tone: "warning" | "info" | "success" }) {
  const cls = tone === "warning" ? "bg-warning/15 text-warning-foreground" : tone === "info" ? "bg-info/15 text-foreground" : "bg-success/10 text-success";
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`flex size-12 items-center justify-center rounded-2xl ${cls}`}>
        <Icon className="size-5" />
      </div>
      <span>{label}</span>
    </div>
  );
}
