import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/app/AppLayout";
import { PageHeader } from "@/components/app/PageHeader";
import { KpiCard } from "@/components/app/KpiCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Boxes, AlertTriangle, PackageX, DollarSign, Plus, Upload, Search } from "lucide-react";
import { StatusBadge } from "@/components/app/StatusBadge";
import { useMemo, useState } from "react";
import { useStore, formatCOP, productStatus, CATEGORIES, type Product } from "@/lib/store";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/inventario")({
  component: InventoryPage,
  head: () => ({ meta: [{ title: "Inventario — TechTrack SaaS" }] }),
});

function InventoryPage() {
  const { products, adjustStock } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [state, setState] = useState<string>("all");
  const [adjust, setAdjust] = useState<Product | null>(null);
  const [delta, setDelta] = useState(0);
  const [reason, setReason] = useState("");

  const filtered = useMemo(() => products.filter((p) => {
    if (q && !`${p.name} ${p.sku}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (cat !== "all" && p.category !== cat) return false;
    if (state !== "all") {
      const s = productStatus(p);
      if (state === "ok" && s !== "ok") return false;
      if (state === "bajo" && s !== "bajo") return false;
      if (state === "agotado" && s !== "agotado") return false;
    }
    return true;
  }), [products, q, cat, state]);

  const total = products.length;
  const low = products.filter((p) => productStatus(p) === "bajo").length;
  const out = products.filter((p) => productStatus(p) === "agotado").length;
  const value = products.reduce((s, p) => s + p.cost * p.stock, 0);

  return (
    <AppLayout>
      <PageHeader
        title="Inventario"
        subtitle="Controla existencias, costos, precios y alertas de stock."
        actions={
          <>
            <Button variant="outline"><Upload className="mr-2 size-4" />Importar</Button>
            <Button asChild><Link to="/inventario/nuevo"><Plus className="mr-2 size-4" />Nuevo producto</Link></Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Total productos" value={String(total)} icon={Boxes} tone="primary" />
        <KpiCard label="Stock bajo" value={String(low)} icon={AlertTriangle} tone="warning" />
        <KpiCard label="Agotados" value={String(out)} icon={PackageX} tone="destructive" />
        <KpiCard label="Valor del inventario" value={formatCOP(value)} icon={DollarSign} tone="success" />
      </div>

      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar producto o SKU…" className="pl-9" />
            </div>
            <Select value={cat} onValueChange={setCat}>
              <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Categoría" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={state} onValueChange={setState}>
              <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Estado" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="ok">En stock</SelectItem>
                <SelectItem value="bajo">Stock bajo</SelectItem>
                <SelectItem value="agotado">Agotado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 overflow-x-auto rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Mín.</TableHead>
                  <TableHead className="text-right">Costo</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Actualizado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => {
                  const s = productStatus(p);
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="text-muted-foreground">{p.category}</TableCell>
                      <TableCell className="text-right">{p.stock}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{p.minStock}</TableCell>
                      <TableCell className="text-right">{formatCOP(p.cost)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCOP(p.price)}</TableCell>
                      <TableCell>
                        {s === "ok" && <StatusBadge tone="success" dot>En stock</StatusBadge>}
                        {s === "bajo" && <StatusBadge tone="warning" dot>Stock bajo</StatusBadge>}
                        {s === "agotado" && <StatusBadge tone="destructive" dot>Agotado</StatusBadge>}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{p.updatedAt}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => { setAdjust(p); setDelta(0); setReason(""); }}>
                          Ajustar
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={10} className="py-10 text-center text-sm text-muted-foreground">Sin resultados.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!adjust} onOpenChange={(v) => !v && setAdjust(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajustar stock — {adjust?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg bg-secondary/50 p-3 text-sm">
              <p>Stock actual: <strong>{adjust?.stock}</strong></p>
              <p className="text-muted-foreground">Nuevo stock: <strong className="text-foreground">{Math.max(0, (adjust?.stock ?? 0) + delta)}</strong></p>
            </div>
            <div>
              <Label>Cantidad a ajustar (use - para egreso)</Label>
              <Input type="number" value={delta} onChange={(e) => setDelta(Number(e.target.value))} />
            </div>
            <div>
              <Label>Motivo</Label>
              <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Ej: Reabastecimiento, merma, devolución…" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjust(null)}>Cancelar</Button>
            <Button onClick={() => {
              if (!adjust || !reason.trim()) { toast.error("Indica el motivo del ajuste."); return; }
              adjustStock(adjust.id, delta, reason);
              toast.success("Stock ajustado correctamente");
              setAdjust(null);
            }}>Confirmar ajuste</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
