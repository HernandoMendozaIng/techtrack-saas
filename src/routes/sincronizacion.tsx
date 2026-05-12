import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app/AppLayout";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/lib/store";
import { RefreshCw, CheckCircle2, Clock, XCircle, Cloud, CloudOff } from "lucide-react";
import { StatusBadge } from "@/components/app/StatusBadge";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/sincronizacion")({
  component: SyncPage,
  head: () => ({ meta: [{ title: "Sincronización — TechTrack SaaS" }] }),
});

function SyncPage() {
  const { sync, isOnline, lastSync, syncNow } = useStore();
  const [loading, setLoading] = useState(false);
  const pending = sync.filter((s) => s.status === "Pendiente");
  const synced = sync.filter((s) => s.status === "Sincronizado");

  return (
    <AppLayout>
      <PageHeader title="Centro de sincronización" subtitle="Gestiona los registros guardados localmente y su envío a la nube." />

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isOnline ? <Cloud className="size-5 text-success" /> : <CloudOff className="size-5 text-warning-foreground" />}
              Estado de sincronización
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-secondary/30 p-4">
                <p className="text-xs text-muted-foreground">Estado</p>
                {isOnline
                  ? <p className="mt-1 text-lg font-semibold text-success">En línea</p>
                  : <p className="mt-1 text-lg font-semibold text-warning-foreground">Sin conexión</p>}
              </div>
              <div className="rounded-xl border border-border bg-secondary/30 p-4">
                <p className="text-xs text-muted-foreground">Pendientes</p>
                <p className="mt-1 text-lg font-semibold">{pending.length}</p>
              </div>
              <div className="rounded-xl border border-border bg-secondary/30 p-4">
                <p className="text-xs text-muted-foreground">Sincronizados hoy</p>
                <p className="mt-1 text-lg font-semibold">{synced.length}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Última sincronización: <strong className="text-foreground">{new Date(lastSync).toLocaleString("es-CO")}</strong>
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Button
                disabled={!isOnline || loading || pending.length === 0}
                onClick={async () => { setLoading(true); await syncNow(); setLoading(false); toast.success("Sincronización completada correctamente."); }}
              >
                <RefreshCw className={`mr-2 size-4 ${loading ? "animate-spin" : ""}`} />
                {loading ? "Sincronizando…" : "Sincronizar ahora"}
              </Button>
              {!isOnline && <p className="text-sm text-muted-foreground">Conéctate a internet para sincronizar.</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>¿Cómo funciona Offline-First?</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Cuando no hay internet, TechTrack guarda la información localmente para que tu negocio siga operando.
              Una vez se restablece la conexión, los datos se sincronizan automáticamente con la nube.
            </p>
            <ol className="mt-4 space-y-2 text-sm">
              <li className="flex gap-2"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">1</span> Registras venta o ajuste sin conexión.</li>
              <li className="flex gap-2"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">2</span> Se guarda como "Pendiente" en tu equipo.</li>
              <li className="flex gap-2"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">3</span> Vuelve internet → sincronización automática.</li>
            </ol>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Registros</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead><TableHead>Descripción</TableHead><TableHead>Fecha</TableHead><TableHead>Estado</TableHead><TableHead className="text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sync.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.type}</TableCell>
                    <TableCell className="text-muted-foreground">{s.description}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(s.date).toLocaleString("es-CO")}</TableCell>
                    <TableCell>
                      {s.status === "Sincronizado" && <StatusBadge tone="success" dot><CheckCircle2 className="size-3" /> Sincronizado</StatusBadge>}
                      {s.status === "Pendiente" && <StatusBadge tone="warning" dot><Clock className="size-3" /> Pendiente</StatusBadge>}
                      {s.status === "Error" && <StatusBadge tone="destructive" dot><XCircle className="size-3" /> Error</StatusBadge>}
                      {s.status === "En proceso" && <StatusBadge tone="info" dot><RefreshCw className="size-3 animate-spin" /> En proceso</StatusBadge>}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" disabled={s.status === "Sincronizado"}>Reintentar</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
