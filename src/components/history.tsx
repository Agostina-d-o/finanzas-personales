"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import {
  categories,
  incomeCategories,
  today,
  money,
  totals,
  type Movement,
} from "@/lib/movements";
import { useMovements } from "./movements-provider";
import { DataState, EmptyState, MonthPicker, MovementRow } from "./shared";
export function History() {
  const params = useSearchParams();
  const query = params.get("mes");
  const { items, save, loading, error } = useMovements();
  const [month, setMonth] = useState(
    query && /^\d{4}-(0[1-9]|1[0-2])$/.test(query)
      ? query
      : today().slice(0, 7),
  );
  const [category, setCategory] = useState("");
  const [deleting, setDeleting] = useState<Movement | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const busy = useRef(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const filtered = items
    .filter(
      (m) => m.date.startsWith(month) && (!category || m.category === category),
    )
    .reverse()
    .sort((a, b) => b.date.localeCompare(a.date));
  async function remove() {
    if (!deleting || busy.current) return;
    busy.current = true;
    setSaving(true);
    setSaveError("");
    try {
      await save(items.filter((m) => m.id !== deleting.id));
      dialog.current?.close();
      setDeleting(null);
      setMessage("Movimiento eliminado.");
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "No se pudo eliminar.");
    } finally {
      setSaving(false);
      busy.current = false;
    }
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">CADA PESO TIENE SU HISTORIA</p>
          <h1>
            Tus movimientos<span>.</span>
          </h1>
          <p>Todo lo que entra y sale, en un solo lugar.</p>
        </div>
        <Link href="/nuevo" className="button primary desktop-new">
          <Plus size={19} />
          Nuevo gasto
        </Link>
      </div>
      <div className="history-toolbar">
        <MonthPicker month={month} onChange={setMonth} />
        <label className="filter-label">
          Categoría
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {[...categories, ...incomeCategories].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        {category && (
          <button className="text-link" onClick={() => setCategory("")}>
            <X size={16} />
            Limpiar filtro
          </button>
        )}
      </div>
      <DataState />
      {!loading && !error && (
        <section className="panel history-panel">
          <div className="panel-heading">
            <div>
              <h2>Historial del mes</h2>
              <p>
                {filtered.length}{" "}
                {filtered.length === 1 ? "movimiento" : "movimientos"}
                {category ? ` · ${category}` : ""}
              </p>
            </div>
            <span className="text-small muted">
              Balance filtrado{" "}
              <strong className="history-total">
                {money(totals(filtered).balance)}
              </strong>
            </span>
          </div>
          {message && (
            <p role="status" className="inline-success">
              {message}
            </p>
          )}
          {filtered.length ? (
            filtered.map((m) => (
              <MovementRow key={m.id} item={m}>
                <div className="row-actions">
                  <Link
                    href={`/nuevo?editar=${m.id}`}
                    aria-label={`Editar ${m.description || m.category}`}
                  >
                    <Pencil size={16} />
                  </Link>
                  <button
                    aria-label={`Eliminar ${m.description || m.category}`}
                    onClick={() => {
                      setDeleting(m);
                      setSaveError("");
                      dialog.current?.showModal();
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </MovementRow>
            ))
          ) : (
            <EmptyState>
              No hay movimientos con estos filtros. Probá otro mes o registrá
              uno nuevo.
            </EmptyState>
          )}
        </section>
      )}
      <dialog
        aria-labelledby="delete-title"
        ref={dialog}
        className="delete-dialog"
        onCancel={(e) => {
          if (saving) e.preventDefault();
        }}
      >
        <div className="dialog-content">
          <span className="delete-icon">
            <Trash2 size={25} />
          </span>
          <h2 id="delete-title">¿Eliminar este movimiento?</h2>
          <p>
            {deleting?.description || deleting?.category} ·{" "}
            {money(deleting?.amount || 0)}
          </p>
          <p className="muted">Se quitará del resumen y del historial.</p>
          {saveError && (
            <p role="alert" className="form-error">
              {saveError}
            </p>
          )}
          <div className="dialog-actions">
            <button
              autoFocus
              disabled={saving}
              className="button secondary"
              onClick={() => dialog.current?.close()}
            >
              Cancelar
            </button>
            <button
              disabled={saving}
              className="button danger"
              onClick={remove}
            >
              {saving ? "Eliminando…" : "Eliminar"}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
