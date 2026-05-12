import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app/AppLayout";
import { PageHeader } from "@/components/app/PageHeader";
import { KpiCard } from "@/components/app/KpiCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore, formatCOP } from "@/lib/store";
import { BarChart3, TrendingUp, AlertTriangle, PackageX, FileSpreadsheet, FileText, Lightbulb } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import { StatusBadge } from "@/components/app/StatusBadge";

export const Route = createFileRoute("/reportes")({
  component: ReportsPage,
  head: () => ({ meta: [{ title: "Reportes — TechTrack SaaS" }] }),
});

const dailySales = [
  { d: "06 May", v: 1250000 }, { d: "07 May", v: 1480000 }, { d: "08 May", v: 1320000 },
  { d: "09 May", v: 1690000 }, { d: "10 May", v: 1810000 }, { d: "11 May", v: 1940000 }, { d: "12 May", v: 1850000 },
];
const categoryShare = [
  { name: "Papelería", v: 42 },
  { name: "Oficina", v: 24 },
  { name: "Empaque", v: 18 },
  { name: "Escolar", v: 11 },
  { name: "Herramientas", v: 5 },
];
const PIE_COLORS = ["var(--color-primary)", "var(--color-accent)", "var(--color-success)", "var(--color-warning)", "var(--color-destructive)"];

function ReportsPage() {
  const { products } = useStore();
  const out = products.filter((p) => p.stock <= 0).length;

  return (
    <AppLayout>
      <PageHeader
        title="Reportes"
        subtitle="Analiza el desempeño operativo y financiero de tu negocio."
        actions={
          <>
            <Button variant="outline"><FileText className="mr-2 size-4" /> Exportar PDF</Button>
            <Button variant="outline"><FileSpreadsheet className="mr-2 size-4" /> Exportar Excel</Button>
          </>
        }
      />

      <Card className="mb-6">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
          <Select defaultValue="7d">
            <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 días</SelectItem>
              <SelectItem value="30d">Últimos 30 días</SelectItem>
              <SelectItem value="90d">Últimos 90 días</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="ventas">
            <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ventas">Ventas</SelectItem>
              <SelectItem value="inventario">Inventario</SelectItem>
              <SelectItem value="caja">Caja</SelectItem>
              <SelectItem value="descuadres">Descuadres</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="principal">
            <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="principal">Sucursal principal</SelectItem>
              <SelectItem value="centro">Sucursal Centro</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Ventas totales" value={formatCOP(11340000)} icon={TrendingUp} tone="primary" trend={{ value: "+18% vs sem. previa", positive: true }} />
        <KpiCard label="Margen estimado" value={formatCOP(4280000)} icon={BarChart3} tone="success" />
        <KpiCard label="Descuadres" value={formatCOP(95000)} icon={AlertTriangle} tone="destructive" />
        <KpiCard label="Productos agotados" value={String(out)} icon={PackageX} tone="warning" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Ventas por día</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="d" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1e6).toFixed(1)}M`} />
                <Tooltip formatter={(v: number) => formatCOP(v)} contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)" }} />
                <Bar dataKey="v" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Categorías de mayor rotación</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryShare} dataKey="v" nameKey="name" outerRadius={80} innerRadius={45} paddingAngle={2}>
                  {categoryShare.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Descuadres recientes</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow><TableHead>Fecha</TableHead><TableHead>Tipo</TableHead><TableHead className="text-right">Monto</TableHead><TableHead>Estado</TableHead><TableHead>Responsable</TableHead><TableHead>Acción</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { d: "12 May", t: "Caja", m: 95000, s: "Pendiente", r: "Hernando M." },
                  { d: "10 May", t: "Inventario", m: 32000, s: "Resuelto", r: "Carla R." },
                  { d: "08 May", t: "Caja", m: 12000, s: "Resuelto", r: "Hernando M." },
                ].map((x) => (
                  <TableRow key={x.d}>
                    <TableCell>{x.d}</TableCell>
                    <TableCell>{x.t}</TableCell>
                    <TableCell className="text-right font-medium">{formatCOP(x.m)}</TableCell>
                    <TableCell>{x.s === "Pendiente" ? <StatusBadge tone="warning" dot>Pendiente</StatusBadge> : <StatusBadge tone="success" dot>Resuelto</StatusBadge>}</TableCell>
                    <TableCell className="text-muted-foreground">{x.r}</TableCell>
                    <TableCell><Button variant="ghost" size="sm">Revisar</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Lightbulb className="size-4 text-warning-foreground" /> Recomendaciones del sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="rounded-lg border border-border bg-secondary/30 p-3">Revisar stock de <strong>Bolígrafo azul</strong> — quedan 6 unidades.</li>
            <li className="rounded-lg border border-border bg-secondary/30 p-3">La categoría <strong>Papelería</strong> concentra el 42% de las ventas semanales.</li>
            <li className="rounded-lg border border-border bg-secondary/30 p-3">Se detectó una diferencia de caja de <strong>{formatCOP(95000)}</strong>; revisar cierre del día.</li>
            <li className="rounded-lg border border-border bg-secondary/30 p-3">Hay registros pendientes de sincronización. Conéctate a internet para enviarlos.</li>
          </ul>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
