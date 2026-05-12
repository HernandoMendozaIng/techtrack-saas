import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Product = {
  id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  cost: number;
  price: number;
  unit: string;
  location: string;
  updatedAt: string;
};

export type SaleItem = { productId: string; name: string; qty: number; price: number };
export type Sale = {
  id: string;
  number: string;
  date: string;
  items: SaleItem[];
  total: number;
  payment: "Efectivo" | "Transferencia" | "Tarjeta" | "Mixto";
  received?: number;
  status: "Sincronizado" | "Pendiente" | "Error";
};

export type CashMovement = {
  id: string;
  date: string;
  type: "Ingreso" | "Egreso" | "Venta" | "Apertura" | "Cierre";
  description: string;
  amount: number;
  responsible: string;
};

export type AlertItem = {
  id: string;
  type: "stock_bajo" | "agotado" | "descuadre" | "sync_pendiente" | "sync_error";
  title: string;
  description: string;
  date: string;
  severity: "alta" | "media" | "baja";
  status: "nueva" | "revisada" | "resuelta";
};

export type SyncRecord = {
  id: string;
  type: string;
  description: string;
  date: string;
  status: "Sincronizado" | "Pendiente" | "Error" | "En proceso";
};

export const CATEGORIES = ["Papelería", "Empaque", "Oficina", "Escolar", "Herramientas"];

const initialProducts: Product[] = [
  { id: "p1", sku: "PAP-001", name: "Resma tamaño carta", category: "Papelería", stock: 42, minStock: 15, cost: 18000, price: 24500, unit: "unidad", location: "A-1", updatedAt: "2025-05-10" },
  { id: "p2", sku: "OFI-002", name: "Bolígrafo azul", category: "Oficina", stock: 6, minStock: 50, cost: 700, price: 1500, unit: "unidad", location: "A-2", updatedAt: "2025-05-11" },
  { id: "p3", sku: "EMP-003", name: "Cinta de embalaje", category: "Empaque", stock: 88, minStock: 20, cost: 3500, price: 6500, unit: "rollo", location: "B-1", updatedAt: "2025-05-09" },
  { id: "p4", sku: "EMP-004", name: "Bolsa plástica industrial", category: "Empaque", stock: 0, minStock: 30, cost: 1200, price: 2200, unit: "paquete", location: "B-2", updatedAt: "2025-05-08" },
  { id: "p5", sku: "OFI-005", name: "Marcador permanente", category: "Oficina", stock: 35, minStock: 20, cost: 2200, price: 4500, unit: "unidad", location: "A-3", updatedAt: "2025-05-10" },
  { id: "p6", sku: "ESC-006", name: "Cuaderno universitario", category: "Escolar", stock: 120, minStock: 40, cost: 4500, price: 8500, unit: "unidad", location: "C-1", updatedAt: "2025-05-11" },
  { id: "p7", sku: "HER-007", name: "Grapadora metálica", category: "Herramientas", stock: 14, minStock: 10, cost: 9500, price: 17000, unit: "unidad", location: "D-1", updatedAt: "2025-05-07" },
  { id: "p8", sku: "OFI-008", name: "Caja de clips", category: "Oficina", stock: 9, minStock: 25, cost: 1800, price: 3500, unit: "caja", location: "A-4", updatedAt: "2025-05-11" },
  { id: "p9", sku: "PAP-009", name: "Papel bond oficio", category: "Papelería", stock: 60, minStock: 20, cost: 19500, price: 27000, unit: "resma", location: "A-5", updatedAt: "2025-05-09" },
  { id: "p10", sku: "PAP-010", name: "Sobre manila", category: "Papelería", stock: 0, minStock: 50, cost: 350, price: 800, unit: "unidad", location: "A-6", updatedAt: "2025-05-06" },
];

const initialSales: Sale[] = [
  { id: "s1", number: "V-1041", date: "2025-05-12T09:14:00", items: [{ productId: "p1", name: "Resma tamaño carta", qty: 3, price: 24500 }], total: 73500, payment: "Efectivo", status: "Sincronizado" },
  { id: "s2", number: "V-1042", date: "2025-05-12T10:02:00", items: [{ productId: "p6", name: "Cuaderno universitario", qty: 5, price: 8500 }], total: 42500, payment: "Tarjeta", status: "Sincronizado" },
  { id: "s3", number: "V-1043", date: "2025-05-12T11:30:00", items: [{ productId: "p3", name: "Cinta de embalaje", qty: 4, price: 6500 }], total: 26000, payment: "Transferencia", status: "Pendiente" },
  { id: "s4", number: "V-1044", date: "2025-05-12T12:10:00", items: [{ productId: "p7", name: "Grapadora metálica", qty: 2, price: 17000 }], total: 34000, payment: "Efectivo", status: "Pendiente" },
];

const initialCash: CashMovement[] = [
  { id: "c1", date: "2025-05-12T08:00:00", type: "Apertura", description: "Caja inicial", amount: 500000, responsible: "Hernando Mendoza" },
  { id: "c2", date: "2025-05-12T09:14:00", type: "Venta", description: "Venta V-1041", amount: 73500, responsible: "Hernando Mendoza" },
  { id: "c3", date: "2025-05-12T10:30:00", type: "Egreso", description: "Compra de papelería menor", amount: -40000, responsible: "Hernando Mendoza" },
  { id: "c4", date: "2025-05-12T11:00:00", type: "Ingreso", description: "Abono cliente Distribuidora SA", amount: 120000, responsible: "Hernando Mendoza" },
];

const initialAlerts: AlertItem[] = [
  { id: "a1", type: "stock_bajo", title: "Bolígrafo azul bajo stock mínimo", description: "Quedan 6 unidades, mínimo recomendado 50.", date: "2025-05-12T08:30:00", severity: "alta", status: "nueva" },
  { id: "a2", type: "agotado", title: "Bolsa plástica industrial agotada", description: "Producto sin existencias en bodega.", date: "2025-05-12T07:50:00", severity: "alta", status: "nueva" },
  { id: "a3", type: "descuadre", title: "Descuadre de caja detectado", description: "Diferencia de COP 95.000 en cierre preliminar.", date: "2025-05-12T12:40:00", severity: "alta", status: "nueva" },
  { id: "a4", type: "sync_pendiente", title: "4 registros pendientes de sincronización", description: "Se sincronizarán cuando vuelva la conexión.", date: "2025-05-12T12:00:00", severity: "media", status: "nueva" },
  { id: "a5", type: "stock_bajo", title: "Caja de clips por debajo del mínimo", description: "Quedan 9 cajas, mínimo recomendado 25.", date: "2025-05-12T09:00:00", severity: "media", status: "revisada" },
];

const initialSync: SyncRecord[] = [
  { id: "y1", type: "Venta", description: "V-1043 — Cinta de embalaje x4", date: "2025-05-12T11:30:00", status: "Pendiente" },
  { id: "y2", type: "Venta", description: "V-1044 — Grapadora metálica x2", date: "2025-05-12T12:10:00", status: "Pendiente" },
  { id: "y3", type: "Ajuste de stock", description: "Resma tamaño carta +10", date: "2025-05-12T10:45:00", status: "Pendiente" },
  { id: "y4", type: "Movimiento de caja", description: "Egreso COP 40.000", date: "2025-05-12T10:30:00", status: "Pendiente" },
  { id: "y5", type: "Venta", description: "V-1041 — Resma tamaño carta x3", date: "2025-05-12T09:14:00", status: "Sincronizado" },
  { id: "y6", type: "Venta", description: "V-1042 — Cuaderno universitario x5", date: "2025-05-12T10:02:00", status: "Sincronizado" },
];

type State = {
  user: { name: string; role: string; email: string };
  company: { name: string; nit: string; city: string; sector: string; currency: string };
  isOnline: boolean;
  lastSync: string;
  products: Product[];
  sales: Sale[];
  cash: CashMovement[];
  alerts: AlertItem[];
  sync: SyncRecord[];
  cashOpen: number;
};

type Ctx = State & {
  setOnline: (v: boolean) => void;
  addProduct: (p: Omit<Product, "id" | "updatedAt">) => void;
  adjustStock: (id: string, delta: number, reason: string) => void;
  addSale: (sale: Omit<Sale, "id" | "number" | "date" | "status">) => Sale;
  addCash: (m: Omit<CashMovement, "id" | "date">) => void;
  resolveAlert: (id: string, status: AlertItem["status"]) => void;
  syncNow: () => Promise<void>;
};

const StoreContext = createContext<Ctx | null>(null);

const KEY = "techtrack-state-v1";

function load(): Partial<State> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const persisted = typeof window !== "undefined" ? load() : null;
  const [products, setProducts] = useState<Product[]>(persisted?.products ?? initialProducts);
  const [sales, setSales] = useState<Sale[]>(persisted?.sales ?? initialSales);
  const [cash, setCash] = useState<CashMovement[]>(persisted?.cash ?? initialCash);
  const [alerts, setAlerts] = useState<AlertItem[]>(persisted?.alerts ?? initialAlerts);
  const [sync, setSync] = useState<SyncRecord[]>(persisted?.sync ?? initialSync);
  const [isOnline, setIsOnline] = useState<boolean>(persisted?.isOnline ?? true);
  const [lastSync, setLastSync] = useState<string>(persisted?.lastSync ?? new Date(Date.now() - 2 * 60 * 1000).toISOString());

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      KEY,
      JSON.stringify({ products, sales, cash, alerts, sync, isOnline, lastSync }),
    );
  }, [products, sales, cash, alerts, sync, isOnline, lastSync]);

  const value = useMemo<Ctx>(() => ({
    user: { name: "Hernando Mendoza", role: "Administrador", email: "hernando@distribuidoral27.co" },
    company: { name: "Distribuidora La 27", nit: "900.123.456-7", city: "Barranquilla", sector: "Comercio al por menor", currency: "COP" },
    isOnline, lastSync,
    products, sales, cash, alerts, sync,
    cashOpen: 500000,
    setOnline: (v) => setIsOnline(v),
    addProduct: (p) => setProducts((prev) => [
      { ...p, id: `p${Date.now()}`, updatedAt: new Date().toISOString().slice(0, 10) },
      ...prev,
    ]),
    adjustStock: (id, delta, reason) => {
      setProducts((prev) => prev.map((x) => x.id === id ? { ...x, stock: Math.max(0, x.stock + delta), updatedAt: new Date().toISOString().slice(0, 10) } : x));
      setSync((prev) => [{ id: `y${Date.now()}`, type: "Ajuste de stock", description: `${reason} (${delta > 0 ? "+" : ""}${delta})`, date: new Date().toISOString(), status: isOnline ? "Sincronizado" : "Pendiente" }, ...prev]);
    },
    addSale: (sale) => {
      const newSale: Sale = {
        ...sale,
        id: `s${Date.now()}`,
        number: `V-${1044 + sales.length + 1}`,
        date: new Date().toISOString(),
        status: isOnline ? "Sincronizado" : "Pendiente",
      };
      setSales((prev) => [newSale, ...prev]);
      // Discount stock
      setProducts((prev) => prev.map((p) => {
        const item = sale.items.find((i) => i.productId === p.id);
        return item ? { ...p, stock: Math.max(0, p.stock - item.qty) } : p;
      }));
      setCash((prev) => [{ id: `c${Date.now()}`, date: new Date().toISOString(), type: "Venta", description: `Venta ${newSale.number}`, amount: newSale.total, responsible: "Hernando Mendoza" }, ...prev]);
      setSync((prev) => [{ id: `y${Date.now()}`, type: "Venta", description: `${newSale.number} — ${sale.items.map((i) => i.name).join(", ")}`, date: newSale.date, status: isOnline ? "Sincronizado" : "Pendiente" }, ...prev]);
      return newSale;
    },
    addCash: (m) => {
      setCash((prev) => [{ ...m, id: `c${Date.now()}`, date: new Date().toISOString() }, ...prev]);
      setSync((prev) => [{ id: `y${Date.now()}`, type: "Movimiento de caja", description: `${m.type} ${formatCOP(Math.abs(m.amount))}`, date: new Date().toISOString(), status: isOnline ? "Sincronizado" : "Pendiente" }, ...prev]);
    },
    resolveAlert: (id, status) => setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, status } : a)),
    syncNow: async () => {
      await new Promise((r) => setTimeout(r, 1200));
      setSync((prev) => prev.map((s) => s.status === "Pendiente" ? { ...s, status: "Sincronizado" } : s));
      setSales((prev) => prev.map((s) => s.status === "Pendiente" ? { ...s, status: "Sincronizado" } : s));
      setLastSync(new Date().toISOString());
    },
  }), [products, sales, cash, alerts, sync, isOnline, lastSync]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function formatCOP(n: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
}

export function productStatus(p: Product): "agotado" | "bajo" | "ok" {
  if (p.stock <= 0) return "agotado";
  if (p.stock < p.minStock) return "bajo";
  return "ok";
}
