import { Suspense } from "react";
import { MovementForm } from "@/components/movement-form";
export default function Page() {
  return (
    <Suspense fallback={<p role="status">Preparando formulario…</p>}>
      <MovementForm />
    </Suspense>
  );
}
