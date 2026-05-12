import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app/AppLayout";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore, type AlertItem } from "@/lib/store";
import { AlertTriangle, PackageX, Banknote, RefreshCw, XCircle } from "lucide-react";
import { StatusBadge } from "@/components/app/StatusBadge";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/alertas")({
  component: AlertsPage,
  head: () => ({ meta: [{ title: "Alertas — TechTrack SaaS" }] }),
});

const iconFor = (t: AlertItem["type"]) => ({
  stock_bajo: AlertTriangle, agotado: PackageX, descuadre: Banknote,
  sync_pendiente: RefreshCw, sync_error: XCircle,
}[t]);

function AlertsPage() {
  const { alerts, resolveAlert } = useStore();
  const [sev, setSev] = useState("all");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => alerts.filter((a) => {
    if (sev !== "all" && a.severity !== sev) return false;
    if (type !== "all" && a.type !== type) return false;
    if (status !== "all" && a.status !== status) return false;
    return true;
  }), [alerts, sev, type, status]);

  return (
    <AppLayout>
      <PageHeader title="Alertas" subtitle="Eventos críticos y notificaciones operativas." />

      <Card className="mb-6">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
          <Select value={sev} onValueChange={setSev}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Severidad" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toda severidad</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="media">Media</SelectItem>
              <SelectItem value="baja">Baja</SelectItem>
            </SelectContent>
          </Select>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Tipo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="stock_bajo">Stock bajo</SelectItem>
              <SelectItem value="agotado">Agotado</SelectItem>
              <SelectItem value="descuadre">Descuadre</SelectItem>
              <SelectItem value="sync_pendiente">Sinc. pendiente</SelectItem>
              <SelectItem value="sync_error">Error de sinc.</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Estado" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="nueva">Nueva</SelectItem>
              <SelectItem value="revisada">Revisada</SelectItem>
              <SelectItem value="resuelta">Resuelta</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {filtered.map((a) => {
          const Icon = iconFor(a.type);
          const tone = a.severity === "alta" ? "destructive" : a.severity === "media" ? "warning" : "info";
          return (
            <Card key={a.id}>
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                  tone === "destructive" ? "bg-destructive/10 text-destructive" :
                  tone === "warning" ? "bg-warning/15 text-warning-foreground" :
                  "bg-info/15 text-foreground"
                }`}>
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{a.title}</p>
                    <StatusBadge tone={tone as "destructive" | "warning" | "info"}>{a.severity}</StatusBadge>
                    {a.status === "nueva" && <StatusBadge tone="primary">Nueva</StatusBadge>}
                    {a.status === "revisada" && <StatusBadge tone="muted">Revisada</StatusBadge>}
                    {a.status === "resuelta" && <StatusBadge tone="success" dot>Resuelta</StatusBadge>}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{a.description}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{new Date(a.date).toLocaleString("es-CO")}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => { resolveAlert(a.id, "revisada"); toast.success("Marcada como revisada"); }}>Marcar revisada</Button>
                  <Button size="sm" onClick={() => { resolveAlert(a.id, "resuelta"); toast.success("Alerta resuelta"); }}>Resolver</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">No hay alertas con esos filtros.</CardContent></Card>
        )}
      </div>
    </AppLayout>
  );
}
