# Mis finanzas · Finanzas Personales

Primera iteración: prototipo funcional en español de Argentina, moneda ARS y diseño responsive.

> **Datos de demostración.** Los registros iniciales son ficticios. Los cambios se guardan temporalmente en localStorage de este navegador, sin respaldo ni sincronización. No ingresar información sensible.

## Instalación y ejecución

Requiere Node.js 22 y npm 10 o superior.

```bash
npm ci
npm run dev
```

Abrir http://localhost:3000. Para producción local: `npm run build` y `npm start`. No requiere credenciales ni variables de entorno.

## Pantallas

- `/`: saldo estimado, ingresos y gastos mensuales, distribución por categoría, últimos movimientos y navegación mensual.
- `/nuevo`: alta de gasto o ingreso, teclado decimal, categoría y débito preseleccionados, fecha local editable, descripción opcional y confirmación.
- `/movimientos`: historial cronológico, filtros por mes y categoría, edición y eliminación con confirmación.
- `/nuevo?editar=<id>`: edición reutilizando el formulario.
- Navegación móvil inferior y soporte de escritorio; estados de carga, vacío y error.

Un gasto habitual requiere importe → Guardar cuando los valores predeterminados aplican. La meta de menos de diez segundos debe medirse con usuarios en teléfonos reales.

## Estructura

```text
src/app/                      Rutas, layout y estilos
src/components/
  shell.tsx                   Navegación responsive
  dashboard.tsx               Resumen mensual
  movement-form.tsx           Alta y edición
  history.tsx                 Historial, filtros y eliminación
  shared.tsx                  Selector de mes, filas y estados
  movements-provider.tsx      Estado y coordinación del repositorio
src/lib/
  movements.ts                Tipos, validación, importes, fechas y demo
  movement-repository.ts      Contrato y adaptador localStorage
tests/                        Pruebas de dominio y almacenamiento
```

Decisiones y evolución en [docs/architecture.md](docs/architecture.md).

## Verificación

```bash
npm run lint
npm test
npm run build
```

Pruebas compiladas con TypeScript y ejecutadas con Node, sin framework adicional: decimales y montos inválidos, fechas, cambio de año, balance, CRUD del repositorio, recarga, lista vacía, corrupción y fallos de escritura. GitHub Actions reproduce los controles.

Prueba manual: registrar `1250,50`, editar, recargar, filtrar categoría, eliminar confirmando y navegar a un mes vacío. Revisar a 390 px y escritorio, con teclado y lector de pantalla.

## Datos temporales y límites

Clave versionada: `finanzas-personales:demo:v1`. La demo se crea solo si la clave no existe. Una lista vacía se conserva y los datos inválidos no se sobrescriben silenciosamente. Para reiniciar, borrar el almacenamiento de este sitio desde el navegador y recargar.

No modificar simultáneamente desde varias pestañas: no hay sincronización ni resolución de conflictos. Borrar los datos del navegador elimina los registros. Ningún dato se envía a un servidor.

No incluye Supabase, login, bancos, CSV, IA, notificaciones, suscripciones ni proyecciones. Próximo paso: validar experiencia y categorías; luego diseñar autenticación, esquema, RLS y adaptador Supabase con operaciones individuales. Hosting en Vercel en una iteración posterior.
