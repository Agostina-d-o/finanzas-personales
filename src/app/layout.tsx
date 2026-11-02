import type { Metadata } from "next";
import { Shell } from "@/components/shell";
import { MovementsProvider } from "@/components/movements-provider";
import "./globals.css";
export const metadata: Metadata = {
  title: "Mis finanzas · Tu dinero, más claro",
  description:
    "Prototipo personal para registrar gastos e ingresos y entender tu mes. Datos de demostración.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-AR">
      <body>
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        <MovementsProvider>
          <Shell>{children}</Shell>
        </MovementsProvider>
      </body>
    </html>
  );
}
