import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/app/AppLayout";
import { PageHeader } from "@/components/app/PageHeader";
import { KpiCard } from "@/components/app/KpiCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/app/StatusBadge";
import {
  Wallet, ShoppingBag, Package, AlertTriangle, RefreshCw, TrendingUp,
  Plus, Boxes, BarChart3, CheckCircle2, Banknote,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar,
} from "recharts";
import { useStore, formatCOP } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Dashboard — TechTrack SaaS" }] }),
});

const salesSeries = [
  { day: "Lun", v: 1200000 },
  { day: "Mar", v: 1480000 },
  { day: "Mié", v: 980000 },
  { day: "Jue", v: 1620000 },
  { day: "Vie", v: 1750000 },
  { day: "Sáb", v: 2100000 },
  { day: "Dom", v: 1850000 },
];

const topProducts = [
  { name: "Cuaderno univ.", qty: 24 },
  { name: "Resma carta", qty: 18 },
  { name: "Cinta embalaje", qty: 14 },
  { name: "Marcador", qty: 11 },
  { name: "Grapadora", qty: 7 },
];

function Dashboard() {
  const { isOnline, sync, lastSync, syncNow } = useStore();
  const pending = sync.filter((s) => s.status === "Pendiente").length;

  return (
    <AppLayout>
      <PageHeader
        title="Dashboard"
        subtitle="Resumen operativo de Distribuidora La 27"
        actions={
          <>
            <Tabs defaultValue="hoy">
              <TabsList>
                <TabsTrigger value="hoy">Hoy</TabsTrigger>
                <TabsTrigger value="semana">Semana</TabsTrigger>
                <TabsTrigger value="mes">Mes</TabsTrigger>
              </TabsList>
            </Tabs>
            <Select defaultValue="principal">
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="principal">Sucursal principal</SelectItem>
                <SelectItem value="centro">Sucursal Centro</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <KpiCard label="Ventas del día" value={formatCOP(1850000)} icon={ShoppingBag} tone="primary" trend={{ value: "+12% vs ayer", positive: true }} />
        <KpiCard label="Caja actual" value={formatCOP(2310000)} icon={Wallet} tone="success" hint="Cuadre pendiente" />
        <KpiCard label="Productos vendidos" value="86" icon={Package} tone="info" />
        <KpiCard label="Stock bajo" value="12 productos" icon={AlertTriangle} tone="warning" />
        <KpiCard label="Descuadres detectados" value={formatCOP(95000)} icon={Banknote} tone="destructive" />
        <KpiCard label="Pendientes de sinc." value={String(pending)} icon={RefreshCw} tone={isOnline ? "info" : "warning"} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Ventas — últimos 7 días</CardTitle>
              <p className="text-xs text-muted-foreground">Comparativa diaria en COP</p>
            </div>
            <StatusBadge tone="success" dot><TrendingUp className="size-3" /> +18% vs semana previa</StatusBadge>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesSeries} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1e6).toFixed(1)}M`} />
                <Tooltip formatter={(v: number) => formatCOP(v)} contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)" }} />
                <Line type="monotone" dataKey="v" stroke="var(--color-primary)" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Productos más vendidos</CardTitle>
            <p className="text-xs text-muted-foreground">Top 5 — hoy</p>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical" margin={{ left: 0, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} width={100} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)" }} />
                <Bar dataKey="qty" fill="var(--color-accent)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Alertas críticas</CardTitle>
            <p className="text-xs text-muted-foreground">Acciones que requieren tu atención</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { tone: "warning" as const, icon: AlertTriangle, t: "Bolígrafo azul está por debajo del stock mínimo", d: "Quedan 6 unidades. Reabastecer pronto." },
              { tone: "destructive" as const, icon: Banknote, t: "Descuadre de caja por COP 95.000", d: "Detectado en el último cierre preliminar." },
              { tone: "info" as const, icon: RefreshCw, t: `${pending} registros pendientes de sincronización`, d: "Se sincronizarán cuando vuelva la conexión." },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-secondary/30 p-3">
                <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                  a.tone === "warning" ? "bg-warning/15 text-warning-foreground" :
                  a.tone === "destructive" ? "bg-destructive/10 text-destructive" :
                  "bg-info/15 text-foreground"
                }`}>
                  <a.icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{a.t}</p>
                  <p className="text-xs text-muted-foreground">{a.d}</p>
                </div>
                <Link to="/alertas" className="text-xs font-medium text-primary hover:underline">Ver</Link>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado operativo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-border bg-secondary/30 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Conexión</span>
                {isOnline ? <StatusBadge tone="success" dot>En línea</StatusBadge> : <StatusBadge tone="warning" dot>Sin conexión</StatusBadge>}
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Última sincronización</dt><dd>{new Date(lastSync).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Pendientes</dt><dd className="font-medium">{pending}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Sincronizados hoy</dt><dd className="font-medium">{sync.filter((s) => s.status === "Sincronizado").length}</dd></div>
              </dl>
              <div className="mt-4 flex flex-col gap-2">
                <Button onClick={() => syncNow()} disabled={!isOnline} size="sm">
                  <RefreshCw className="mr-2 size-4" /> Sincronizar ahora
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to="/sincronizacion">Ver centro de sincronización</Link>
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Acciones rápidas</p>
              <div className="grid grid-cols-2 gap-2">
                <Button asChild variant="outline" size="sm"><Link to="/ventas"><ShoppingBag className="mr-2 size-4" />Vender</Link></Button>
                <Button asChild variant="outline" size="sm"><Link to="/inventario/nuevo"><Plus className="mr-2 size-4" />Producto</Link></Button>
                <Button asChild variant="outline" size="sm"><Link to="/caja"><Wallet className="mr-2 size-4" />Cerrar caja</Link></Button>
                <Button asChild variant="outline" size="sm"><Link to="/reportes"><BarChart3 className="mr-2 size-4" />Reportes</Link></Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Actividad reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border">
            {[
              { i: CheckCircle2, t: "Venta V-1042 registrada", d: "Cuaderno universitario × 5", time: "10:02" },
              { i: Boxes, t: "Producto actualizado", d: "Resma tamaño carta — costo y precio", time: "09:48" },
              { i: Package, t: "Ajuste de inventario", d: "Cinta de embalaje +20", time: "09:15" },
              { i: Wallet, t: "Cierre de caja parcial", d: "Diferencia detectada COP 95.000", time: "08:55" },
              { i: RefreshCw, t: "Sincronización completada", d: "12 registros enviados", time: "08:30" },
            ].map((a, idx) => (
              <li key={idx} className="flex items-center gap-3 py-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-secondary text-foreground">
                  <a.i className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.t}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.d}</p>
                </div>
                <span className="text-xs text-muted-foreground">{a.time}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
