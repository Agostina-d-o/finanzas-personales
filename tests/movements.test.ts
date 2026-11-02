import { test } from "node:test";
import assert from "node:assert/strict";
import {
  money,
  demoMovements,
  parseAmount,
  shiftMonth,
  totals,
  validDate,
} from "../src/lib/movements";
import { LocalMovementRepository } from "../src/lib/movement-repository";
test("ARS: decimales exactos, importes inválidos y límites", () => {
  assert.match(money(125050), /1\.250,50/);
  assert.equal(parseAmount("1250,50"), 125050);
  assert.equal(parseAmount("0.29"), 29);
  for (const value of [
    "0",
    "-1",
    "1.234,50",
    "1e3",
    "NaN",
    "1,234",
    "",
    "12345678901",
  ])
    assert.equal(parseAmount(value), null);
});
test("fechas locales válidas y navegación entre años", () => {
  assert.equal(shiftMonth("2026-01", -1), "2025-12");
  assert.equal(shiftMonth("2026-12", 1), "2027-01");
  assert.equal(validDate("2024-02-29"), true);
  assert.equal(validDate("2026-02-29"), false);
  assert.equal(validDate("2026-13-01"), false);
});
test("balance mensual respeta ingresos, gastos y mes", () => {
  const data = demoMovements(new Date(2026, 10, 1));
  const summary = totals(data.filter((m) => m.date.startsWith("2026-11")));
  assert.deepEqual(summary, {
    income: 125000000,
    expense: 52330000,
    balance: 72670000,
  });
  assert.deepEqual(totals([]), { income: 0, expense: 0, balance: 0 });
});
test("repositorio: altas, ediciones, bajas y lista vacía sobreviven recarga", async () => {
  let raw: string | null = null;
  const storage = {
    getItem: () => raw,
    setItem: (_key: string, value: string) => {
      raw = value;
    },
  };
  const repo = new LocalMovementRepository(storage);
  const data = await repo.load();
  assert.ok(data.length > 0);
  const added = { ...data[0], id: "new", amount: 123 };
  await repo.save([...data, added]);
  assert.equal((await repo.load()).at(-1)?.amount, 123);
  await repo.save([{ ...added, amount: 456 }]);
  assert.equal((await repo.load())[0].amount, 456);
  await repo.save([]);
  assert.deepEqual(await repo.load(), []);
});
test("datos dañados y almacenamiento bloqueado se propagan sin sobrescribir", async () => {
  for (const raw of ["{", "{}", '[{"id":"bad"}]']) {
    let writes = 0;
    const repo = new LocalMovementRepository({
      getItem: () => raw,
      setItem: () => {
        writes++;
      },
    });
    await assert.rejects(repo.load());
    assert.equal(writes, 0);
  }
  const repo = new LocalMovementRepository({
    getItem: () => null,
    setItem: () => {
      throw new Error("QuotaExceededError");
    },
  });
  await assert.rejects(repo.load());
  await assert.rejects(repo.save([]));
});
