import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Boxes, ShoppingCart, Wallet, BarChart3, Bell,
  RefreshCw, Settings, LifeBuoy, WifiOff, Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/inventario", label: "Inventario", icon: Boxes },
  { to: "/ventas", label: "Ventas", icon: ShoppingCart },
  { to: "/caja", label: "Caja", icon: Wallet },
  { to: "/reportes", label: "Reportes", icon: BarChart3 },
  { to: "/alertas", label: "Alertas", icon: Bell },
  { to: "/sincronizacion", label: "Sincronización", icon: RefreshCw },
  { to: "/configuracion", label: "Configuración", icon: Settings },
  { to: "/soporte", label: "Soporte", icon: LifeBuoy },
] as const;

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { user, company } = useStore();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-4">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Building2 className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">TechTrack SaaS</p>
          <p className="truncate text-xs text-muted-foreground">{company.name}</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-0.5">
          {items.map((it) => {
            const active = path === it.to || (it.to !== "/dashboard" && path.startsWith(it.to));
            return (
              <li key={it.to}>
                <Link
                  to={it.to}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                  )}
                >
                  <it.icon className="size-4" />
                  {it.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 rounded-xl border border-dashed border-border bg-secondary/40 p-3">
          <div className="flex items-center gap-2 text-xs font-medium text-foreground">
            <WifiOff className="size-3.5 text-primary" />
            Offline-First
          </div>
          <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
            Sigue operando aunque falle internet. Sincroniza después de forma automática.
          </p>
          <Link
            to="/offline-demo"
            onClick={onNavigate}
            className="mt-2 inline-block text-[11px] font-medium text-primary hover:underline"
          >
            Ver cómo funciona →
          </Link>
        </div>
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-lg p-2">
          <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            HM
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
