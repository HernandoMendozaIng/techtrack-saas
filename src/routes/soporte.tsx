import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app/AppLayout";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LifeBuoy, BookOpen, Sparkles, MessageSquare } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";

export const Route = createFileRoute("/soporte")({
  component: SupportPage,
  head: () => ({ meta: [{ title: "Soporte — TechTrack SaaS" }] }),
});

function SupportPage() {
  return (
    <AppLayout>
      <PageHeader title="Soporte" subtitle="Estamos aquí para ayudarte a sacar el máximo provecho de TechTrack." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { i: BookOpen, t: "Centro de ayuda", d: "Guías paso a paso" },
          { i: Sparkles, t: "Solicitar demo", d: "Agenda con el equipo" },
          { i: LifeBuoy, t: "Contactar soporte", d: "Respuesta en menos de 24h" },
          { i: MessageSquare, t: "Preguntas frecuentes", d: "Respuestas rápidas" },
        ].map((c) => (
          <Card key={c.t} className="transition hover:border-primary/40 hover:shadow-[var(--shadow-card)]">
            <CardContent className="p-5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><c.i className="size-5" /></div>
              <p className="mt-3 font-semibold">{c.t}</p>
              <p className="text-sm text-muted-foreground">{c.d}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Contáctanos</CardTitle></CardHeader>
          <CardContent>
            <form
              className="space-y-3"
              onSubmit={(e) => { e.preventDefault(); toast.success("Solicitud enviada correctamente."); (e.target as HTMLFormElement).reset(); }}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div><Label>Nombre</Label><Input required /></div>
                <div><Label>Empresa</Label><Input required /></div>
              </div>
              <div><Label>Correo</Label><Input type="email" required /></div>
              <div><Label>Mensaje</Label><Textarea rows={4} required placeholder="¿En qué te podemos ayudar?" /></div>
              <Button type="submit">Enviar solicitud</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Preguntas frecuentes</CardTitle></CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {[
                { q: "¿Qué pasa si se cae internet?", a: "TechTrack sigue funcionando. Las ventas, ajustes y movimientos se guardan localmente y se sincronizan automáticamente al volver la conexión." },
                { q: "¿Puedo usar TechTrack desde el celular?", a: "Sí, la aplicación es responsive y funciona en escritorio, tablet y móvil con la misma experiencia." },
                { q: "¿Puedo exportar reportes?", a: "Sí, puedes exportar tus reportes a PDF o Excel directamente desde la sección de Reportes." },
                { q: "¿Necesito instalar algo?", a: "No. TechTrack se ejecuta desde el navegador. Próximamente disponible como PWA instalable." },
                { q: "¿Mis datos quedan guardados?", a: "Sí, todos los datos quedan respaldados en la nube y sincronizados con tu equipo cuando hay conexión." },
              ].map((f, i) => (
                <AccordionItem key={i} value={`f${i}`}>
                  <AccordionTrigger className="text-left text-sm font-medium">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
