import { Bell, Search, Wifi, WifiOff, RefreshCw, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useStore } from "@/lib/store";
import { StatusBadge } from "./StatusBadge";
import { useEffect, useState } from "react";

function timeAgo(iso: string) {
  const diff = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  if (diff < 60) return `hace ${diff} min`;
  const h = Math.floor(diff / 60);
  if (h < 24) return `hace ${h} h`;
  return `hace ${Math.floor(h / 24)} d`;
}

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { isOnline, setOnline, lastSync, sync } = useStore();
  const pending = sync.filter((s) => s.status === "Pendiente").length;
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(i);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-sm sm:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
        <Menu className="size-5" />
      </Button>
      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar productos, ventas, clientes…"
          className="h-9 pl-9 bg-secondary/50 border-transparent focus-visible:bg-card"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-border bg-secondary/40 px-3 py-1.5 lg:flex">
          {isOnline ? (
            <StatusBadge tone="success" dot>En línea</StatusBadge>
          ) : (
            <StatusBadge tone="warning" dot>Sin conexión</StatusBadge>
          )}
          <span className="text-xs text-muted-foreground">
            <RefreshCw className="mr-1 inline size-3" />
            Última sinc.: {timeAgo(lastSync)}
            <span aria-hidden className="hidden">{tick}</span>
          </span>
          {pending > 0 && (
            <StatusBadge tone="info">{pending} pendientes</StatusBadge>
          )}
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          {isOnline ? <Wifi className="size-4 text-success" /> : <WifiOff className="size-4 text-warning-foreground" />}
          <span className="text-xs text-muted-foreground">Simular sin conexión</span>
          <Switch checked={!isOnline} onCheckedChange={(v) => setOnline(!v)} />
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
        </Button>

        <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
          HM
        </div>
      </div>
    </header>
  );
}
