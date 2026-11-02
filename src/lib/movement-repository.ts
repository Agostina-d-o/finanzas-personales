import { demoMovements, isMovement, type Movement } from "./movements";
export interface MovementRepository {
  load(): Promise<Movement[]>;
  save(movements: Movement[]): Promise<void>;
}
const KEY = "finanzas-personales:demo:v1";
export class LocalMovementRepository implements MovementRepository {
  constructor(private storage: Pick<Storage, "getItem" | "setItem">) {}
  async load() {
    const raw = this.storage.getItem(KEY);
    if (raw === null) {
      const data = demoMovements();
      await this.save(data);
      return data;
    }
    const parsed: unknown = JSON.parse(raw);
    if (
      !Array.isArray(parsed) ||
      !parsed.every(isMovement) ||
      new Set(parsed.map((m) => m.id)).size !== parsed.length
    )
      throw new Error("Datos locales inválidos");
    return parsed;
  }
  async save(movements: Movement[]) {
    this.storage.setItem(KEY, JSON.stringify(movements));
  }
}
