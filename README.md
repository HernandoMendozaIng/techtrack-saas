# TechTrack SaaS

**Prototipo funcional de una solución tecnológica para control de inventario, ventas, caja y sincronización offline-first en MiPymes.**

---

## 1. Descripción general

**TechTrack SaaS** es un prototipo funcional desarrollado como evidencia práctica para la asignatura **Emprendimiento de Base Tecnológica** del programa de **Ingeniería de Sistemas** de la Universidad Nacional Abierta y a Distancia — UNAD.

La iniciativa nace a partir de la identificación, validación y análisis estratégico de una problemática frecuente en MiPymes de comercialización, manufactura ligera y retail: la pérdida de trazabilidad operativa, los descuadres financieros, el inventario desactualizado y la dependencia de registros manuales o sistemas fragmentados.

El prototipo busca demostrar cómo una solución web tipo SaaS/PWA puede ayudar a pequeños negocios a controlar sus operaciones críticas mediante una interfaz simple, moderna y funcional.

---

## 2. Nombre de la iniciativa

**TechTrack SaaS**

---

## 3. Problema identificado

Las MiPymes que manejan inventario físico y ventas de mostrador suelen enfrentar dificultades como:

- Pérdida de trazabilidad en entradas y salidas de inventario.
- Descuadres entre caja, ventas e inventario.
- Uso excesivo de Excel, cuadernos o registros manuales.
- Errores humanos en el cierre de caja.
- Falta de reportes claros para la toma de decisiones.
- Miedo a depender completamente de soluciones en la nube cuando la conexión a internet es inestable.
- Dificultad para detectar robos hormiga, productos agotados o inconsistencias operativas.

---

## 4. Propuesta de valor

> **TechTrack SaaS ayuda a las MiPymes de comercialización, manufactura ligera y retail a controlar inventario, caja y ventas mediante una plataforma web offline-first, reduciendo descuadres financieros, pérdida de mercancía y horas de auditoría manual, mientras permite continuidad operativa, trazabilidad y decisiones gerenciales basadas en datos confiables.**

---

## 5. Diferenciador principal

El principal diferenciador del prototipo es el enfoque **offline-first**.

Esto significa que el sistema está diseñado para comunicar y simular que el negocio puede seguir operando incluso si falla la conexión a internet. Las ventas, movimientos de inventario y cierres de caja pueden quedar como registros pendientes de sincronización y luego actualizarse cuando la conexión se restablece.

Este enfoque responde a una necesidad crítica de las MiPymes: **no detener la operación del punto de venta por problemas de conectividad**.

---

## 6. Objetivo del prototipo

Desarrollar una aplicación web navegable y funcional que permita validar la experiencia inicial de uso de TechTrack SaaS, demostrando:

- Gestión de inventario.
- Registro de productos.
- Registro de ventas tipo POS.
- Control de caja.
- Reportes operativos.
- Alertas de stock bajo y descuadres.
- Simulación de modo sin conexión.
- Centro de sincronización.
- Configuración del negocio.
- Soporte y contacto.

---

## 7. Alcance del proyecto

Este proyecto corresponde a un **prototipo funcional simulado**, no a una versión productiva final.

El sistema no implementa backend real, autenticación real ni base de datos remota. Su objetivo es representar la propuesta de valor, la navegación, la experiencia de usuario y la lógica operativa básica de la solución.

El prototipo puede ser usado para:

- Pruebas de usabilidad.
- Presentación académica.
- Validación temprana de propuesta de valor.
- Demostración de flujo offline-first.
- Evidencia de avance técnico del emprendimiento.

---

## 8. Tecnologías utilizadas

El proyecto está construido con tecnologías modernas de frontend:

- **React**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **shadcn/ui**
- **lucide-react**
- **Recharts**
- **React Router DOM**
- **localStorage** para persistencia simulada
- **Vercel** para despliegue

---

## 9. Arquitectura funcional

La aplicación se estructura como una SPA —Single Page Application— con rutas internas para simular los módulos principales del SaaS.

### Rutas principales

```txt
/login
/dashboard
/inventario
/inventario/nuevo
/ventas
/caja
/reportes
/alertas
/sincronizacion
/offline-demo
/configuracion
/soporte