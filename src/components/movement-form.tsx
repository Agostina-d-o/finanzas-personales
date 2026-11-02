"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowLeft, Check, Plus, ShieldCheck } from "lucide-react";
import {
  categories,
  incomeCategories,
  payments,
  parseAmount,
  today,
  validDate,
  type Movement,
  type Category,
} from "@/lib/movements";
import { useMovements } from "./movements-provider";
import { categoryIcons, DataState } from "./shared";
export function MovementForm() {
  const { items, loading, error } = useMovements();
  const params = useSearchParams();
  const id = params.get("editar");
  const existing = items.find((m) => m.id === id);
  if (loading || error) return <DataState />;
  if (id && !existing)
    return (
      <div className="panel empty">
        <h1>Movimiento no encontrado</h1>
        <Link className="button secondary" href="/movimientos">
          Volver al historial
        </Link>
      </div>
    );
  return <Form key={id || "new"} existing={existing} />;
}
function Form({ existing }: { existing?: Movement }) {
  const router = useRouter();
  const { items, save } = useMovements();
  const [type, setType] = useState<Movement["type"]>(
    existing?.type || "expense",
  );
  const [category, setCategory] = useState<Category>(
    existing?.category || "Alimentación",
  );
  const [payment, setPayment] = useState<Movement["payment"]>(
    existing?.payment || "Débito",
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const busy = useRef(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const data = new FormData(event.currentTarget);
    const amount = parseAmount(String(data.get("amount")));
    const date = String(data.get("date"));
    const description = String(data.get("description") || "").trim();
    if (!amount) {
      setError(
        "Ingresá un importe mayor a cero, con hasta 2 decimales y sin separadores de miles.",
      );
      return;
    }
    if (!validDate(date)) {
      setError("Ingresá una fecha válida entre 1900 y 2100.");
      return;
    }
    if (description.length > 120) {
      setError("La descripción puede tener hasta 120 caracteres.");
      return;
    }
    busy.current = true;
    setSaving(true);
    setError("");
    try {
      const item: Movement = {
        id: existing?.id || crypto.randomUUID(),
        type,
        amount,
        category,
        payment,
        date,
        description,
      };
      await save(
        existing
          ? items.map((m) => (m.id === existing.id ? item : m))
          : [...items, item],
      );
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo guardar. Intentá de nuevo.",
      );
    } finally {
      busy.current = false;
      setSaving(false);
    }
  }
  if (success)
    return (
      <div className="success-panel panel" role="status">
        <span className="success-check">
          <Check size={32} />
        </span>
        <p className="eyebrow">UN PASO MÁS, TODO EN ORDEN</p>
        <h1>{existing ? "Cambios guardados" : "¡Listo, ya lo registraste!"}</h1>
        <p>El movimiento ya está en tu resumen y en el historial.</p>
        <div className="success-actions">
          <button
            className="button primary"
            onClick={() => router.push("/movimientos")}
          >
            Ver movimientos
          </button>
          {!existing && (
            <button
              className="button secondary"
              onClick={() => {
                setSuccess(false);
                router.refresh();
              }}
            >
              Registrar otro
            </button>
          )}
        </div>
        <p className="text-small muted">
          Guardado temporalmente en este navegador.
        </p>
      </div>
    );
  return (
    <div className="form-page">
      <Link href={existing ? "/movimientos" : "/"} className="back-link">
        <ArrowLeft size={17} />
        Volver {existing ? "al historial" : "al resumen"}
      </Link>
      <div className="page-heading">
        <div>
          <p className="eyebrow">ANOTALO Y SEGUÍ CON TU DÍA</p>
          <h1>
            {existing ? "Editar movimiento" : "Un movimiento nuevo"}
            <span>.</span>
          </h1>
          <p>Con un par de datos, ya está.</p>
        </div>
      </div>
      <form className="panel movement-form" onSubmit={submit}>
        <div className="segmented" aria-label="Tipo de movimiento">
          {(["expense", "income"] as const).map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={type === t}
              className={type === t ? "selected" : ""}
              onClick={() => {
                setType(t);
                setCategory(t === "expense" ? "Alimentación" : "Sueldo");
              }}
            >
              {t === "expense" ? "Gasto" : "Ingreso"}
            </button>
          ))}
        </div>
        <label className="amount-label" htmlFor="amount">
          ¿Cuánto {type === "expense" ? "gastaste" : "ingresaste"}?
        </label>
        <div className="amount-input">
          <span>$</span>
          <input
            key={success ? "reset" : "amount"}
            autoFocus
            id="amount"
            name="amount"
            aria-describedby="amount-help"
            inputMode="decimal"
            placeholder="0"
            defaultValue={
              existing ? String(existing.amount / 100).replace(".", ",") : ""
            }
            required
            autoComplete="off"
            maxLength={13}
          />
          <span className="currency-label">ARS</span>
        </div>
        <p id="amount-help" className="field-hint">
          Sin separadores de miles. Podés usar coma para los centavos.
        </p>
        <fieldset>
          <legend>Categoría</legend>
          <div className="category-options">
            {(type === "expense" ? categories : incomeCategories).map((c) => {
              const Icon = categoryIcons[c];
              return (
                <label
                  key={c}
                  className={
                    category === c
                      ? "category-option selected"
                      : "category-option"
                  }
                >
                  <input
                    type="radio"
                    name="category"
                    value={c}
                    checked={category === c}
                    onChange={() => setCategory(c)}
                    required
                  />
                  <Icon size={20} />
                  {c}
                </label>
              );
            })}
          </div>
        </fieldset>
        <div className="form-two-columns">
          <label>
            Medio de pago
            <select
              value={payment}
              onChange={(e) =>
                setPayment(e.target.value as Movement["payment"])
              }
              required
            >
              {payments.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
          <label>
            Fecha
            <input
              name="date"
              type="date"
              defaultValue={existing?.date || today()}
              min="1900-01-01"
              max="2100-12-31"
              required
            />
          </label>
        </div>
        <label>
          Descripción <span className="optional">opcional</span>
          <input
            name="description"
            defaultValue={existing?.description}
            placeholder="Por ejemplo, café con amigos"
            maxLength={120}
          />
        </label>
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <button
          disabled={saving}
          type="submit"
          className="button primary save-button"
        >
          {saving ? <span className="spinner" /> : <Plus size={19} />}{" "}
          {saving
            ? "Guardando…"
            : existing
              ? "Guardar cambios"
              : type === "expense"
                ? "Guardar gasto"
                : "Guardar ingreso"}
        </button>
        <p className="form-note">
          <ShieldCheck size={15} />
          Demo local · Guardado temporal en este navegador
        </p>
      </form>
    </div>
  );
}
