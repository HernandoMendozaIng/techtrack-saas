import { WifiOff } from "lucide-react";
import { useStore } from "@/lib/store";
import { Link } from "@tanstack/react-router";

export function OfflineBanner() {
  const { isOnline } = useStore();
  if (isOnline) return null;
  return (
    <div className="flex flex-col items-start justify-between gap-2 border-b border-warning/40 bg-warning/15 px-4 py-2.5 text-sm text-foreground sm:flex-row sm:items-center sm:px-6">
      <div className="flex items-start gap-2">
        <WifiOff className="mt-0.5 size-4 shrink-0 text-warning-foreground" />
        <p>
          <strong className="font-semibold">Sin conexión.</strong>{" "}
          Puedes seguir registrando ventas y movimientos. Los datos se sincronizarán cuando vuelva internet.
        </p>
      </div>
      <Link to="/sincronizacion" className="text-xs font-medium text-primary hover:underline">
        Ver pendientes →
      </Link>
    </div>
  );
}
