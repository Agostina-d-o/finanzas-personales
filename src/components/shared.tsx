"use client";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBasket,
  Bus,
  House,
  Coffee,
  HeartPulse,
  ShoppingBag,
  Ellipsis,
  BriefcaseBusiness,
  Wallet,
  ArrowDownLeft,
  Inbox,
} from "lucide-react";
import {
  monthLabel,
  shiftMonth,
  money,
  type Movement,
  type Category,
} from "@/lib/movements";
import { useMovements } from "./movements-provider";
export const categoryIcons = {
  Alimentación: ShoppingBasket,
  Transporte: Bus,
  Hogar: House,
  Salidas: Coffee,
  Salud: HeartPulse,
  Compras: ShoppingBag,
  Otros: Ellipsis,
  Sueldo: BriefcaseBusiness,
  "Trabajo independiente": Wallet,
  "Otros ingresos": ArrowDownLeft,
};
export const categoryColors: Record<Category, string> = {
  Alimentación: "#e4a25c",
  Transporte: "#779bb7",
  Hogar: "#427565",
  Salidas: "#b393bf",
  Salud: "#87a885",
  Compras: "#c68a7d",
  Otros: "#a0a49f",
  Sueldo: "#427565",
  "Trabajo independiente": "#427565",
  "Otros ingresos": "#427565",
};
export function MonthPicker({
  month,
  onChange,
}: {
  month: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="month-picker">
      <button
        aria-label="Mes anterior"
        onClick={() => onChange(shiftMonth(month, -1))}
      >
        <ChevronLeft size={18} />
      </button>
      <span aria-live="polite">{monthLabel(month)}</span>
      <button
        aria-label="Mes siguiente"
        onClick={() => onChange(shiftMonth(month, 1))}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
export function DataState() {
  const { loading, error, retry } = useMovements();
  if (loading)
    return (
      <div className="panel loading" role="status">
        <span className="spinner" />
        Preparando tu espacio…
      </div>
    );
  if (error)
    return (
      <div className="panel error" role="alert">
        <h2>No pudimos abrir los movimientos</h2>
        <p>{error}</p>
        <button className="button secondary" onClick={retry}>
          Reintentar
        </button>
      </div>
    );
  return null;
}
export function EmptyState({ children }: { children?: React.ReactNode }) {
  return (
    <div className="empty">
      <Inbox size={34} strokeWidth={1.3} />
      <h3>Por acá todavía no hay movimientos</h3>
      <p>{children || "Registrá un movimiento para empezar a ver tu mes."}</p>
    </div>
  );
}
export function MovementRow({
  item,
  children,
}: {
  item: Movement;
  children?: React.ReactNode;
}) {
  const Icon = categoryIcons[item.category];
  return (
    <div className="movement-row">
      <span
        className="category-icon"
        style={{
          color: categoryColors[item.category],
          background: `${categoryColors[item.category]}18`,
        }}
      >
        <Icon size={20} />
      </span>
      <div className="movement-description">
        <strong>{item.description || item.category}</strong>
        <small>
          {item.category} <span>·</span> {item.payment}
        </small>
      </div>
      <div className="movement-value">
        <strong className={item.type === "income" ? "income" : ""}>
          {item.type === "income" ? "+" : "−"} {money(item.amount)}
        </strong>
        <small>
          {new Date(`${item.date}T12:00:00`).toLocaleDateString("es-AR", {
            day: "numeric",
            month: "short",
          })}
        </small>
      </div>
      {children}
    </div>
  );
}
