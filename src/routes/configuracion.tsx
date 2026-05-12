import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app/AppLayout";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/lib/store";
import { StatusBadge } from "@/components/app/StatusBadge";
import { toast } from "sonner";

export const Route = createFileRoute("/configuracion")({
  component: SettingsPage,
  head: () => ({ meta: [{ title: "Configuración — TechTrack SaaS" }] }),
});

const users = [
  { name: "Hernando Mendoza", email: "hernando@distribuidoral27.co", role: "Administrador" },
  { name: "Carla Restrepo", email: "carla@distribuidoral27.co", role: "Cajero" },
  { name: "Jorge Pérez", email: "jorge@distribuidoral27.co", role: "Bodega" },
  { name: "María Linares", email: "maria@contadores.co", role: "Contador" },
];

function SettingsPage() {
  const { user, company } = useStore();

  return (
    <AppLayout>
      <PageHeader
        title="Configuración"
        subtitle="Personaliza tu cuenta, negocio, usuarios y preferencias."
        actions={<Button onClick={() => toast.success("Cambios guardados")}>Guardar cambios</Button>}
      />

      <Tabs defaultValue="perfil">
        <TabsList>
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="negocio">Negocio</TabsTrigger>
          <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
          <TabsTrigger value="notif">Notificaciones</TabsTrigger>
          <TabsTrigger value="pref">Preferencias</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Información personal</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div><Label>Nombre</Label><Input defaultValue={user.name} /></div>
              <div><Label>Correo</Label><Input defaultValue={user.email} /></div>
              <div><Label>Rol</Label><Input defaultValue={user.role} disabled /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="negocio" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Datos del negocio</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div><Label>Nombre del negocio</Label><Input defaultValue={company.name} /></div>
              <div><Label>NIT</Label><Input defaultValue={company.nit} /></div>
              <div><Label>Ciudad</Label><Input defaultValue={company.city} /></div>
              <div><Label>Sector</Label><Input defaultValue={company.sector} /></div>
              <div><Label>Moneda</Label><Input defaultValue={company.currency} /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usuarios" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Usuarios y roles</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-xl border border-border">
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>Nombre</TableHead><TableHead>Correo</TableHead><TableHead>Rol</TableHead><TableHead>Estado</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.email}>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell className="text-muted-foreground">{u.email}</TableCell>
                        <TableCell>{u.role}</TableCell>
                        <TableCell><StatusBadge tone="success" dot>Activo</StatusBadge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notif" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Notificaciones</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                "Stock bajo",
                "Descuadres de caja",
                "Sincronización fallida",
                "Reporte diario",
              ].map((n) => (
                <div key={n} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <span className="text-sm font-medium">{n}</span>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pref" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Preferencias</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { t: "Sincronización automática al recuperar conexión", c: true },
                { t: "Mostrar alertas en pantalla", c: true },
                { t: "Sonido al registrar venta", c: false },
              ].map((p) => (
                <div key={p.t} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <span className="text-sm font-medium">{p.t}</span>
                  <Switch defaultChecked={p.c} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
