# feat: primera iteración de Finanzas Personales

## Resultado

El repositorio vacío pasa a tener un prototipo Next.js App Router con TypeScript, Tailwind y Lucide para registrar gastos e ingresos y entender el mes, en español de Argentina y ARS.

Incluye dashboard mensual con categorías, registro rápido y confirmación, historial filtrable con edición y eliminación confirmada, navegación móvil y escritorio. Datos ficticios identificados y adaptador localStorage separado de la presentación. Sin credenciales ni servicios externos.

## Arquitectura

Rutas en `src/app`, componentes reutilizables en `src/components`, dominio y contrato de repositorio en `src/lib`. Importes en centavos, validación de datos guardados y estados de fallo. README y decisiones documentadas. Supabase y hosting quedan fuera del alcance.

## Validación

- `npm run lint`: sin errores ni advertencias.
- `npm test`: 5 pruebas aprobadas.
- `npm run build`: compilación y tipos correctos; tres rutas de aplicación.
- Navegador a 390 px y escritorio: alta con centavos, edición, eliminación con confirmación, filtros y estado vacío. Sin errores de consola observados.

## Límites

Almacenamiento temporal en un navegador, sin sincronización, autenticación ni respaldo. Categorías y medios provisionales. La meta de registro en menos de diez segundos requiere medición con usuarios en dispositivos reales.

Rama: `feat/primera-iteracion`. Base: `main`. No fusionar automáticamente.
