import { Suspense } from "react";
import { History } from "@/components/history";
export default function Page() {
  return (
    <Suspense fallback={<p role="status">Cargando historial…</p>}>
      <History />
    </Suspense>
  );
}
