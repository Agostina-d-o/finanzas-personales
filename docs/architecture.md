# Decisiones de arquitectura · Iteración 1

## Base

Next.js App Router y TypeScript estricto. Rutas pequeñas e interacción en componentes cliente. El layout conserva el provider durante la navegación. Tailwind CSS 4 integrado por PostCSS, estilos con variables CSS y Lucide. Sin librería de gráficos: anillo CSS y lista textual equivalente. Sin fuentes remotas, imágenes externas ni llamadas a terceros.

## Dominio

Movimiento: ID, tipo gasto/ingreso, importe entero en centavos, categoría, medio de pago, fecha `YYYY-MM-DD` y descripción. Fecha local sin conversión UTC. Formulario con coma o punto decimal, sin separadores de miles, hasta dos decimales y diez dígitos enteros. Importe positivo y fecha entre 1900 y 2100. Dentro del mismo día se muestran primero los registros agregados más recientemente.

Los ingresos tienen categorías propias. Ingresos menos gastos define el saldo mensual estimado; no representa un saldo bancario. Demo generada al primer uso para el mes local actual y el anterior.

## Separación y evolución

La presentación usa `useMovements()` y nunca accede directamente a localStorage. `MovementsProvider` coordina carga, estado y guardado. `MovementRepository` define métodos asíncronos y `LocalMovementRepository` implementa el almacenamiento temporal.

El adaptador guarda una colección completa, adecuado para una demo pequeña. Para datos remotos debe ampliarse el contrato a listar/crear/actualizar/eliminar por ID, con autenticación, RLS, paginación y control de conflictos. Reemplazar solo la clase no sería suficiente para producción.

## Consistencia y fallos

Se valida el contenido recuperado, IDs duplicados y categorías compatibles. Los datos corruptos no se sobrescriben. La UI cambia solo después del guardado exitoso. Errores de cuota/permisos conservan el formulario y permiten reintentar. Guardado y eliminación bloquean envíos duplicados. La eliminación usa un diálogo nativo con foco inicial en Cancelar y soporte Escape.

Sin API, credenciales, login ni datos bancarios. localStorage no es persistencia final ni almacén de datos sensibles. No tiene respaldo ni sincronización entre dispositivos/pestañas; última escritura gana.

## Accesibilidad y experiencia

Enlace para saltar al contenido, labels visibles, fieldset y radios de categorías, foco visible, regiones de estado y navegación móvil fija. Controles nativos para fechas y medios de pago. El registro habitual puede requerir solo importe y guardar. La meta de diez segundos requiere pruebas con usuarios en dispositivos reales.

## Verificación

Lint, build y tipos de Next.js, pruebas de dominio/adaptador con Node y flujos manuales en navegador. CI reproduce lint, pruebas y build. Sin dependencias de autenticación, base de datos o gráficos fuera del alcance.
