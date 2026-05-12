import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/app/AppLayout";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { CATEGORIES, useStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/inventario/nuevo")({
  component: NewProduct,
  head: () => ({ meta: [{ title: "Nuevo producto — TechTrack SaaS" }] }),
});

function NewProduct() {
  const { addProduct } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", sku: "", category: "", description: "",
    cost: 0, price: 0,
    stock: 0, minStock: 0, unit: "unidad", location: "",
  });
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (stay: boolean) => {
    if (!form.name || !form.sku || !form.category) {
      toast.error("Completa nombre, SKU y categoría.");
      return;
    }
    addProduct({
      name: form.name, sku: form.sku, category: form.category,
      cost: Number(form.cost), price: Number(form.price),
      stock: Number(form.stock), minStock: Number(form.minStock),
      unit: form.unit, location: form.location,
    });
    toast.success("Producto guardado correctamente");
    if (stay) {
      setForm({ ...form, name: "", sku: "", description: "", stock: 0 });
    } else {
      navigate({ to: "/inventario" });
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Nuevo producto"
        subtitle="Registra un producto en tu catálogo de inventario."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Información básica</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><Label>Nombre del producto *</Label><Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Ej: Resma tamaño carta" /></div>
              <div><Label>Código / SKU *</Label><Input value={form.sku} onChange={(e) => set("sku", e.target.value)} placeholder="PAP-011" /></div>
              <div>
                <Label>Categoría *</Label>
                <Select value={form.category} onValueChange={(v) => set("category", v)}>
                  <SelectTrigger><SelectValue placeholder="Selecciona…" /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2"><Label>Descripción</Label><Textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Detalles, presentación, marca…" /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Información comercial</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div><Label>Costo unitario (COP)</Label><Input type="number" value={form.cost} onChange={(e) => set("cost", Number(e.target.value))} /></div>
              <div><Label>Precio de venta (COP)</Label><Input type="number" value={form.price} onChange={(e) => set("price", Number(e.target.value))} /></div>
              <div>
                <Label>IVA</Label>
                <Select defaultValue="19">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Exento (0%)</SelectItem>
                    <SelectItem value="5">5%</SelectItem>
                    <SelectItem value="19">19%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Inventario</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div><Label>Stock inicial</Label><Input type="number" value={form.stock} onChange={(e) => set("stock", Number(e.target.value))} /></div>
              <div><Label>Stock mínimo</Label><Input type="number" value={form.minStock} onChange={(e) => set("minStock", Number(e.target.value))} /></div>
              <div>
                <Label>Unidad de medida</Label>
                <Select value={form.unit} onValueChange={(v) => set("unit", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unidad">Unidad</SelectItem>
                    <SelectItem value="caja">Caja</SelectItem>
                    <SelectItem value="paquete">Paquete</SelectItem>
                    <SelectItem value="rollo">Rollo</SelectItem>
                    <SelectItem value="resma">Resma</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Ubicación</Label><Input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Ej: A-1" /></div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader><CardTitle>Acciones</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" onClick={() => submit(false)}>Guardar producto</Button>
              <Button className="w-full" variant="outline" onClick={() => submit(true)}>Guardar y crear otro</Button>
              <Button className="w-full" variant="ghost" onClick={() => navigate({ to: "/inventario" })}>Cancelar</Button>
              <p className="pt-3 text-xs text-muted-foreground">
                Los campos marcados con * son obligatorios. Los productos se sincronizan automáticamente cuando hay conexión.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
