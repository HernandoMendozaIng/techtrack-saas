import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/app/AppLayout";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore, formatCOP } from "@/lib/store";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Download, Share2, Plus } from "lucide-react";

export const Route = createFileRoute("/ventas/detalle")({
  component: SaleDetail,
  head: () => ({ meta: [{ title: "Detalle de venta — TechTrack SaaS" }] }),
});

function SaleDetail() {
  const { sales } = useStore();
  const sale = sales[0];
  if (!sale) {
    return (
      <AppLayout>
        <PageHeader title="Comprobante" />
        <p className="text-muted-foreground">Aún no hay ventas registradas.</p>
      </AppLayout>
    );
  }
  return (
    <AppLayout>
      <PageHeader title={`Venta ${sale.number}`} subtitle="Comprobante de venta" actions={
        <>
          <Button variant="outline"><Share2 className="mr-2 size-4" />Compartir</Button>
          <Button variant="outline"><Download className="mr-2 size-4" />Descargar</Button>
          <Button asChild><Link to="/ventas"><Plus className="mr-2 size-4" />Nueva venta</Link></Button>
        </>
      } />
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Distribuidora La 27</CardTitle>
              <p className="text-xs text-muted-foreground">NIT 900.123.456-7 · Barranquilla</p>
            </div>
            {sale.status === "Sincronizado"
              ? <StatusBadge tone="success" dot>Sincronizado</StatusBadge>
              : <StatusBadge tone="warning" dot>Pendiente</StatusBadge>}
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-3 border-y border-border py-3 text-sm">
              <div><dt className="text-muted-foreground">N° Venta</dt><dd className="font-medium">{sale.number}</dd></div>
              <div><dt className="text-muted-foreground">Fecha</dt><dd className="font-medium">{new Date(sale.date).toLocaleString("es-CO")}</dd></div>
              <div><dt className="text-muted-foreground">Método</dt><dd className="font-medium">{sale.payment}</dd></div>
              <div><dt className="text-muted-foreground">Cajero</dt><dd className="font-medium">Hernando Mendoza</dd></div>
            </dl>

            <table className="mt-4 w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground">
                <tr><th className="py-2 text-left">Producto</th><th className="text-right">Cant.</th><th className="text-right">Precio</th><th className="text-right">Subtotal</th></tr>
              </thead>
              <tbody>
                {sale.items.map((i) => (
                  <tr key={i.productId} className="border-t border-border">
                    <td className="py-2">{i.name}</td>
                    <td className="text-right">{i.qty}</td>
                    <td className="text-right">{formatCOP(i.price)}</td>
                    <td className="text-right font-medium">{formatCOP(i.qty * i.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6 flex items-center justify-between rounded-lg bg-primary/10 p-4">
              <span className="text-sm font-medium text-primary">Total</span>
              <span className="text-2xl font-semibold text-primary">{formatCOP(sale.total)}</span>
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Gracias por su compra. Conserve este comprobante.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
