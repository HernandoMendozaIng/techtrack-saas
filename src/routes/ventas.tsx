import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/app/AppLayout";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore, formatCOP, productStatus } from "@/lib/store";
import { useMemo, useState } from "react";
import { Search, Plus, Minus, Trash2, ShoppingCart, CheckCircle2, WifiOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/app/StatusBadge";

export const Route = createFileRoute("/ventas")({
  component: SalesPOS,
  head: () => ({ meta: [{ title: "Ventas — TechTrack SaaS" }] }),
});

type CartItem = { productId: string; name: string; qty: number; price: number; max: number };

function SalesPOS() {
  const { products, addSale, isOnline } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [payment, setPayment] = useState<"Efectivo" | "Transferencia" | "Tarjeta" | "Mixto">("Efectivo");
  const [received, setReceived] = useState<number>(0);
  const [done, setDone] = useState<{ open: boolean; sale?: ReturnType<typeof addSale> }>({ open: false });

  const cats = ["all", ...Array.from(new Set(products.map((p) => p.category)))];
  const filtered = useMemo(() => products.filter((p) => {
    if (productStatus(p) === "agotado") return false;
    if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
    if (cat !== "all" && p.category !== cat) return false;
    return true;
  }), [products, q, cat]);

  const add = (id: string) => {
    const p = products.find((x) => x.id === id)!;
    setCart((c) => {
      const exists = c.find((i) => i.productId === id);
      if (exists) {
        return c.map((i) => i.productId === id ? { ...i, qty: Math.min(i.qty + 1, p.stock) } : i);
      }
      return [...c, { productId: id, name: p.name, qty: 1, price: p.price, max: p.stock }];
    });
  };
  const setQty = (id: string, q: number) => setCart((c) => c.map((i) => i.productId === id ? { ...i, qty: Math.max(1, Math.min(q, i.max)) } : i));
  const remove = (id: string) => setCart((c) => c.filter((i) => i.productId !== id));

  const total = cart.reduce((s, i) => s + i.qty * i.price, 0);
  const change = Math.max(0, received - total);

  const finalize = () => {
    if (cart.length === 0) return;
    const sale = addSale({
      items: cart.map(({ productId, name, qty, price }) => ({ productId, name, qty, price })),
      total, payment, received,
    });
    setDone({ open: true, sale });
    setCart([]); setReceived(0);
  };

  return (
    <AppLayout>
      <PageHeader
        title="Punto de venta"
        subtitle="Registra ventas rápidas. Funciona también sin conexión."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar producto…" className="pl-9" />
              </div>
              <Select value={cat} onValueChange={setCat}>
                <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {cats.map((c) => <SelectItem key={c} value={c}>{c === "all" ? "Todas las categorías" : c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p) => (
                <button
                  key={p.id}
                  onClick={() => add(p.id)}
                  className="group flex flex-col items-start rounded-xl border border-border bg-card p-3 text-left transition hover:border-primary/40 hover:shadow-[var(--shadow-card)]"
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground">{p.sku}</span>
                    {productStatus(p) === "bajo" && <StatusBadge tone="warning">Bajo</StatusBadge>}
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.category} · {p.stock} {p.unit}</p>
                  <div className="mt-3 flex w-full items-center justify-between">
                    <span className="text-base font-semibold text-foreground">{formatCOP(p.price)}</span>
                    <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground transition group-hover:scale-105">
                      <Plus className="size-4" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="self-start lg:sticky lg:top-20">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><ShoppingCart className="size-4" /> Carrito</CardTitle>
            {!isOnline && <StatusBadge tone="warning" dot><WifiOff className="size-3" /> Offline</StatusBadge>}
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
                Agrega productos del catálogo
              </p>
            ) : (
              <ul className="space-y-2">
                {cart.map((i) => (
                  <li key={i.productId} className="flex items-center gap-2 rounded-lg border border-border p-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{i.name}</p>
                      <p className="text-xs text-muted-foreground">{formatCOP(i.price)} c/u</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="outline" className="size-7" onClick={() => setQty(i.productId, i.qty - 1)}><Minus className="size-3" /></Button>
                      <Input className="h-7 w-12 text-center" value={i.qty} onChange={(e) => setQty(i.productId, Number(e.target.value) || 1)} />
                      <Button size="icon" variant="outline" className="size-7" onClick={() => setQty(i.productId, i.qty + 1)}><Plus className="size-3" /></Button>
                    </div>
                    <span className="w-20 text-right text-sm font-medium">{formatCOP(i.qty * i.price)}</span>
                    <Button size="icon" variant="ghost" className="size-7 text-muted-foreground" onClick={() => remove(i.productId)}><Trash2 className="size-3" /></Button>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 space-y-3 border-t border-border pt-4">
              <div className="space-y-1.5">
                <Label>Método de pago</Label>
                <Select value={payment} onValueChange={(v) => setPayment(v as typeof payment)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Efectivo">Efectivo</SelectItem>
                    <SelectItem value="Transferencia">Transferencia</SelectItem>
                    <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                    <SelectItem value="Mixto">Mixto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {payment === "Efectivo" && (
                <div className="space-y-1.5">
                  <Label>Monto recibido</Label>
                  <Input type="number" value={received} onChange={(e) => setReceived(Number(e.target.value))} />
                  <p className="text-xs text-muted-foreground">Cambio: <span className="font-medium text-foreground">{formatCOP(change)}</span></p>
                </div>
              )}

              <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-xl font-semibold">{formatCOP(total)}</span>
              </div>

              <Button className="w-full" disabled={cart.length === 0} onClick={finalize}>
                Finalizar venta
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" disabled={cart.length === 0}>Guardar borrador</Button>
                <Button variant="ghost" onClick={() => setCart([])}>Cancelar</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={done.open} onOpenChange={(v) => setDone({ open: v, sale: done.sale })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-success" /> Venta registrada
            </DialogTitle>
          </DialogHeader>
          {done.sale && (
            <div className="space-y-3">
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">N° {done.sale.number}</p>
                  {done.sale.status === "Sincronizado"
                    ? <StatusBadge tone="success" dot>Sincronizada</StatusBadge>
                    : <StatusBadge tone="warning" dot>Pendiente de sinc.</StatusBadge>}
                </div>
                <p className="mt-2 text-2xl font-semibold">{formatCOP(done.sale.total)}</p>
                <p className="text-xs text-muted-foreground">{done.sale.payment} · {new Date(done.sale.date).toLocaleString("es-CO")}</p>
              </div>
              <p className="text-sm">
                {done.sale.status === "Sincronizado"
                  ? "Venta registrada y sincronizada correctamente."
                  : "Venta guardada localmente. Se sincronizará cuando vuelva internet."}
              </p>
              <div className="flex gap-2">
                <Button asChild variant="outline" className="flex-1"><Link to="/ventas/detalle">Ver comprobante</Link></Button>
                <Button className="flex-1" onClick={() => setDone({ open: false })}>Nueva venta</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
