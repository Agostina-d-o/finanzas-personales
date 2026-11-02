"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  LocalMovementRepository,
  type MovementRepository,
} from "@/lib/movement-repository";
import type { Movement } from "@/lib/movements";
type Store = {
  items: Movement[];
  loading: boolean;
  error: string;
  retry: () => void;
  save: (items: Movement[]) => Promise<void>;
};
const Context = createContext<Store | null>(null);
export function MovementsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const repository = useRef<MovementRepository | null>(null);
  const load = async () => {
    setLoading(true);
    setError("");
    try {
      repository.current = new LocalMovementRepository(window.localStorage);
      setItems(await repository.current.load());
    } catch {
      setError(
        "No pudimos leer la demo local. Revisá que el almacenamiento del navegador esté habilitado. Si los datos están dañados, podés borrar los datos de este sitio desde el navegador.",
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      if (active) void load();
    });
    return () => {
      active = false;
    };
  }, []);
  const save = async (next: Movement[]) => {
    if (!repository.current || error)
      throw new Error("Almacenamiento no disponible.");
    try {
      await repository.current.save(next);
      setItems(next);
    } catch {
      throw new Error(
        "No se pudo guardar. Revisá el espacio y los permisos del navegador e intentá de nuevo.",
      );
    }
  };
  return (
    <Context.Provider value={{ items, loading, error, retry: load, save }}>
      {children}
    </Context.Provider>
  );
}
export function useMovements() {
  const context = useContext(Context);
  if (!context) throw new Error("Falta MovementsProvider");
  return context;
}
