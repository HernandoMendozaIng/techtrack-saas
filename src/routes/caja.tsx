import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app/AppLayout";
import { PageHeader } from "@/components/app/PageHeader";
import { KpiCard } from "@/components/app/KpiCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore, formatCOP } from "@/lib/store";
import { Wallet, ArrowDownCircle, ArrowUpCircle, ScaleIcon, Lock } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/app/StatusBadge";

export const Route = createFileRoute("/caja")({
  component: CashPage,
  head: () => ({ meta: [{ title: "Caja — TechTrack SaaS" }] }),
});

function CashPage() {
  const { cash, cashOpen, addCash } = useStore();
  const [openIncome, setOpenIncome] = useState(false);
  const [openExpense, setOpenExpense] = useState(false);
  const [openClose, setOpenClose] = useState(false);
  const [amount, setAmount] = useState(0);
  const [desc, setDesc] = useState("");
  const [counted, setCounted] = useState(0);
  const [notes, setNotes] = useState("");

  const sales = useMemo(() => cash.filter((c) => c.type === "Venta").reduce((s, c) => s + c.amount, 0), [cash]);
  const expenses = useMemo(() => cash.filter((c) => c.amount < 0).reduce((s, c) => s + c.amount, 0), [cash]);
  const expected = cashOpen + cash.reduce((s, c) => s + (c.type === "Apertura" ? 0 : c.amount), 0);
  const diff = counted - expected;

  return (
    <AppLayout>
      <PageHeader
        title="Caja"
        subtitle="Controla ingresos, egresos y cierre diario."
        actions={
          <>
            <Button variant="outline" onClick={() => { setAmount(0); setDesc(""); setOpenIncome(true); }}>
              <ArrowDownCircle className="mr-2 size-4" /> Ingreso
            </Button>
            <Button variant="outline" onClick={() => { setAmount(0); setDesc(""); setOpenExpense(true); }}>
              <ArrowUpCircle className="mr-2 size-4" /> Egreso
            </Button>
            <Button onClick={() => { setCounted(expected); setNotes(""); setOpenClose(true); }}>
              <Lock className="mr-2 size-4" /> Cerrar caja
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Caja inicial" value={formatCOP(cashOpen)} icon={Wallet} tone="info" />
        <KpiCard label="Ventas registradas" value={formatCOP(sales)} icon={ArrowDownCircle} tone="success" />
        <KpiCard label="Egresos" value={formatCOP(Math.abs(expenses))} icon={ArrowUpCircle} tone="warning" />
        <KpiCard label="Caja esperada" value={formatCOP(expected)} icon={ScaleIcon} tone="primary" />
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Movimientos</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead>Responsable</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cash.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="text-xs text-muted-foreground">{new Date(m.date).toLocaleString("es-CO")}</TableCell>
                    <TableCell>
                      <StatusBadge tone={m.type === "Egreso" ? "warning" : m.type === "Venta" ? "success" : m.type === "Apertura" ? "info" : "primary"}>
                        {m.type}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>{m.description}</TableCell>
                    <TableCell className={`text-right font-medium ${m.amount < 0 ? "text-destructive" : ""}`}>{formatCOP(m.amount)}</TableCell>
                    <TableCell className="text-muted-foreground">{m.responsible}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Income/Expense */}
      <Dialog open={openIncome || openExpense} onOpenChange={(v) => { if (!v) { setOpenIncome(false); setOpenExpense(false); }}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{openIncome ? "Registrar ingreso" : "Registrar egreso"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label>Descripción</Label><Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Concepto del movimiento" /></div>
            <div><Label>Monto (COP)</Label><Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setOpenIncome(false); setOpenExpense(false); }}>Cancelar</Button>
            <Button onClick={() => {
              if (!desc || !amount) { toast.error("Completa descripción y monto."); return; }
              addCash({ type: openIncome ? "Ingreso" : "Egreso", description: desc, amount: openIncome ? Math.abs(amount) : -Math.abs(amount), responsible: "Hernando Mendoza" });
              toast.success("Movimiento registrado");
              setOpenIncome(false); setOpenExpense(false);
            }}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close cash */}
      <Dialog open={openClose} onOpenChange={setOpenClose}>
        <DialogContent>
          <DialogHeader><DialogTitle>Cierre de caja</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="rounded-lg bg-secondary/50 p-3 text-sm">
              <div className="flex justify-between"><span>Monto esperado</span><strong>{formatCOP(expected)}</strong></div>
            </div>
            <div><Label>Monto contado</Label><Input type="number" value={counted} onChange={(e) => setCounted(Number(e.target.value))} /></div>
            <div className={`rounded-lg p-3 text-sm ${diff === 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
              <div className="flex justify-between"><span>Diferencia</span><strong>{formatCOP(diff)}</strong></div>
              <p className="mt-1 text-xs">{diff === 0 ? "Caja cuadrada correctamente." : "Se detectó un descuadre. Revisa antes de confirmar."}</p>
            </div>
            <div><Label>Observaciones</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenClose(false)}>Cancelar</Button>
            <Button onClick={() => {
              addCash({ type: "Cierre", description: `Cierre — diferencia ${formatCOP(diff)}`, amount: 0, responsible: "Hernando Mendoza" });
              toast.success("Cierre de caja registrado");
              setOpenClose(false);
            }}>Confirmar cierre</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
