"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRight,
  Plus,
  Leaf,
  Wallet,
} from "lucide-react";
import { categories, money, today, totals } from "@/lib/movements";
import { useMovements } from "./movements-provider";
import {
  categoryColors,
  categoryIcons,
  DataState,
  EmptyState,
  MonthPicker,
  MovementRow,
} from "./shared";
export function Dashboard() {
  const { items, loading, error } = useMovements();
  const [month, setMonth] = useState(() => today().slice(0, 7));
  const filtered = items
    .filter((m) => m.date.startsWith(month))
    .reverse()
    .sort((a, b) => b.date.localeCompare(a.date));
  const summary = totals(filtered);
  const distribution = categories
    .map((category) => ({
      category,
      amount: filtered
        .filter((m) => m.type === "expense" && m.category === category)
        .reduce((sum, m) => sum + m.amount, 0),
    }))
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);
  const gradient = distribution
    .map((c, index) => {
      const start =
        (distribution
          .slice(0, index)
          .reduce((sum, item) => sum + item.amount, 0) /
          summary.expense) *
        360;
      const end = start + (c.amount / summary.expense) * 360;
      return `${categoryColors[c.category]} ${start}deg ${end}deg`;
    })
    .join(",");
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">CADA MOVIMIENTO CUENTA</p>
          <h1>
            Tu mes, más claro<span>.</span>
          </h1>
          <p>Un vistazo a cómo viene tu dinero.</p>
        </div>
        <Link href="/nuevo" className="button primary desktop-new">
          <Plus size={19} />
          Nuevo gasto
        </Link>
      </div>
      <div className="section-toolbar">
        <MonthPicker month={month} onChange={setMonth} />
        <span className="muted text-small">
          Tu resumen mensual en pesos argentinos
        </span>
      </div>
      <DataState />
      {!loading && !error && (
        <>
          <section className="summary-grid" aria-label="Resumen del mes">
            <article className="balance-card">
              <div className="stat-label">
                <span>Saldo mensual estimado</span>
                <Wallet size={20} />
              </div>
              <strong className="stat-value">{money(summary.balance)}</strong>
              <div className="balance-caption">
                <span className="light-dot" />
                Ingresos menos gastos de este mes
              </div>
              <div className="balance-decoration" />
            </article>
            <article className="stat-card">
              <div className="stat-label">
                <span>Ingresos del mes</span>
                <span className="stat-icon green">
                  <ArrowDownLeft size={20} />
                </span>
              </div>
              <strong className="stat-value">{money(summary.income)}</strong>
              <small>
                {filtered.filter((m) => m.type === "income").length}{" "}
                {filtered.filter((m) => m.type === "income").length === 1
                  ? "ingreso registrado"
                  : "ingresos registrados"}
              </small>
            </article>
            <article className="stat-card">
              <div className="stat-label">
                <span>Gastos del mes</span>
                <span className="stat-icon peach">
                  <ArrowUpRight size={20} />
                </span>
              </div>
              <strong className="stat-value">{money(summary.expense)}</strong>
              <small>
                {filtered.filter((m) => m.type === "expense").length}{" "}
                {filtered.filter((m) => m.type === "expense").length === 1
                  ? "gasto registrado"
                  : "gastos registrados"}
              </small>
            </article>
          </section>
          <div className="dashboard-grid">
            <section className="panel categories-panel">
              <div className="panel-heading">
                <div>
                  <h2>¿En qué se fue?</h2>
                  <p>Tus gastos por categoría</p>
                </div>
                <span className="subtle-icon">
                  <Leaf size={19} />
                </span>
              </div>
              {distribution.length ? (
                <>
                  <div className="donut-wrap">
                    <div
                      className="donut"
                      role="img"
                      aria-label={`Gastos del mes: ${money(summary.expense)}. Detalle por categoría debajo.`}
                      style={{ background: `conic-gradient(${gradient})` }}
                    >
                      <div>
                        <small>Total de gastos</small>
                        <strong>{money(summary.expense)}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="category-list">
                    {distribution.map((c) => {
                      const Icon = categoryIcons[c.category];
                      return (
                        <div key={c.category} className="category-line">
                          <span
                            className="legend-dot"
                            style={{ background: categoryColors[c.category] }}
                          />
                          <Icon size={16} className="muted" />
                          <span>{c.category}</span>
                          <strong>{money(c.amount)}</strong>
                          <small>
                            {Math.round((c.amount / summary.expense) * 100)}%
                          </small>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <EmptyState>
                  Este mes todavía no tiene gastos. Tu próximo registro
                  aparecerá acá.
                </EmptyState>
              )}
            </section>
            <section className="panel recent-panel">
              <div className="panel-heading">
                <div>
                  <h2>Últimos movimientos</h2>
                  <p>Los pequeños pasos de tu mes</p>
                </div>
                <Link href={`/movimientos?mes=${month}`} className="text-link">
                  Ver todos <ArrowRight size={16} />
                </Link>
              </div>
              <div>
                {filtered.length ? (
                  filtered
                    .slice(0, 5)
                    .map((m) => <MovementRow key={m.id} item={m} />)
                ) : (
                  <EmptyState />
                )}
              </div>
              <Link className="quick-add" href="/nuevo">
                <span className="quick-plus">
                  <Plus size={20} />
                </span>
                <span>
                  Un gasto menos para acordarte
                  <small>Registralo ahora y seguí con tu día.</small>
                </span>
                <ArrowUpRight size={20} />
              </Link>
            </section>
          </div>
          <div className="demo-notice">
            <span className="demo-notice-icon">i</span>
            <p>
              <strong>Estás explorando una demo.</strong> Los movimientos
              iniciales son ficticios. Tus cambios se guardan temporalmente en
              este navegador.
            </p>
            <span>Solo en este dispositivo</span>
          </div>
        </>
      )}
    </>
  );
}
