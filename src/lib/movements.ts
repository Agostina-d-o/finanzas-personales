export const categories = [
  "Alimentación",
  "Transporte",
  "Hogar",
  "Salidas",
  "Salud",
  "Compras",
  "Otros",
] as const;
export const incomeCategories = [
  "Sueldo",
  "Trabajo independiente",
  "Otros ingresos",
] as const;
export const payments = [
  "Débito",
  "Crédito",
  "Efectivo",
  "Transferencia",
] as const;
export type Category =
  (typeof categories)[number] | (typeof incomeCategories)[number];
export type Movement = {
  id: string;
  type: "expense" | "income";
  amount: number;
  category: Category;
  payment: (typeof payments)[number];
  date: string;
  description: string;
};
export type MovementInput = Omit<Movement, "id">;
export const today = () => localDate(new Date());
export function localDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function shiftMonth(month: string, delta: number) {
  const [year, m] = month.split("-").map(Number);
  return localDate(new Date(year, m - 1 + delta, 1)).slice(0, 7);
}
export function monthLabel(month: string) {
  return new Date(`${month}-01T12:00:00`).toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric",
  });
}
export const money = (cents: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
export function parseAmount(value: string): number | null {
  const cleaned = value.trim();
  if (!/^\d{1,10}([,.]\d{1,2})?$/.test(cleaned)) return null;
  const [whole, fraction = ""] = cleaned.replace(",", ".").split(".");
  const result = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return result > 0 && Number.isSafeInteger(result) ? result : null;
}
export function validDate(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    value >= "1900-01-01" &&
    value <= "2100-12-31" &&
    localDate(new Date(`${value}T12:00:00`)) === value
  );
}
export function isMovement(value: unknown): value is Movement {
  if (!value || typeof value !== "object") return false;
  const m = value as Movement;
  return (
    typeof m.id === "string" &&
    m.id.length > 0 &&
    (m.type === "expense" || m.type === "income") &&
    Number.isSafeInteger(m.amount) &&
    m.amount > 0 &&
    (m.type === "expense" ? categories : incomeCategories).some(
      (category) => category === m.category,
    ) &&
    payments.includes(m.payment) &&
    validDate(m.date) &&
    typeof m.description === "string" &&
    m.description.length <= 120
  );
}
export function totals(items: Movement[]) {
  const income = items
    .filter((m) => m.type === "income")
    .reduce((a, m) => a + m.amount, 0);
  const expense = items
    .filter((m) => m.type === "expense")
    .reduce((a, m) => a + m.amount, 0);
  return { income, expense, balance: income - expense };
}
export function demoMovements(now = new Date()): Movement[] {
  const month = localDate(now).slice(0, 7);
  const prev = shiftMonth(month, -1);
  const rows: [
    Movement["type"],
    number,
    Category,
    Movement["payment"],
    string,
    string,
  ][] = [
    [
      "income",
      125000000,
      "Sueldo",
      "Transferencia",
      `${month}-01`,
      "Sueldo del mes",
    ],
    [
      "expense",
      6850000,
      "Alimentación",
      "Débito",
      `${month}-01`,
      "Compra del súper",
    ],
    ["expense", 35000000, "Hogar", "Transferencia", `${month}-01`, "Alquiler"],
    ["expense", 1240000, "Transporte", "Débito", `${month}-01`, "Carga SUBE"],
    [
      "expense",
      2850000,
      "Salidas",
      "Crédito",
      `${month}-01`,
      "Cena con amigos",
    ],
    ["expense", 1890000, "Salud", "Débito", `${month}-01`, "Farmacia"],
    [
      "expense",
      4500000,
      "Compras",
      "Crédito",
      `${month}-01`,
      "Unas zapatillas",
    ],
    [
      "income",
      18000000,
      "Trabajo independiente",
      "Transferencia",
      `${prev}-25`,
      "Proyecto freelance",
    ],
    [
      "expense",
      4200000,
      "Alimentación",
      "Efectivo",
      `${prev}-28`,
      "Compras del mes",
    ],
  ];
  return rows.map((r, i) => ({
    id: `demo-${i}`,
    type: r[0],
    amount: r[1],
    category: r[2],
    payment: r[3],
    date: r[4],
    description: r[5],
  }));
}
