"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  ChartNoAxesCombined,
  History,
  Plus,
  Sprout,
} from "lucide-react";
export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const links = [
    { href: "/", label: "Resumen", icon: ChartNoAxesCombined },
    { href: "/movimientos", label: "Movimientos", icon: History },
  ];
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link href="/" className="brand">
          <span className="brand-icon">
            <Sprout size={23} />
          </span>
          <span>
            mis finanzas
            <span className="brand-sub">UN POCO MÁS DE CLARIDAD</span>
          </span>
        </Link>
        <nav aria-label="Navegación principal">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={path === href ? "page" : undefined}
              className={path === href ? "nav-link active" : "nav-link"}
            >
              <Icon size={20} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-note">
          <span className="tiny-label">PASO A PASO</span>
          <p>
            Tu dinero, un poco
            <br />
            más en orden.
          </p>
          <Sprout size={38} strokeWidth={1.2} />
        </div>
        <div className="sidebar-bottom">
          <span className="avatar">A</span>
          <div>
            Mi espacio personal<small>Pesos argentinos · ARS</small>
          </div>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <span className="topbar-title">Tu espacio personal</span>
          <span className="demo-chip">
            <span /> Modo demostración
          </span>
        </header>
        <main id="contenido">{children}</main>
        <footer className="page-footer">
          Hecho para que llevar tus cuentas sea más simple.
          <span>Prototipo · Datos de demostración</span>
        </footer>
      </div>
      <nav className="bottom-nav" aria-label="Navegación móvil">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={path === href ? "active" : ""}
            aria-current={path === href ? "page" : undefined}
          >
            <Icon size={22} />
            {label}
          </Link>
        ))}
        <Link href="/nuevo" className="mobile-add">
          <Plus size={22} />
          Nuevo gasto
        </Link>
      </nav>
      <Link
        href="/nuevo"
        className="floating-add"
        aria-label="Agregar un nuevo gasto"
      >
        <Plus size={22} />
        <span>Nuevo gasto</span>
        <ArrowUpRight size={17} />
      </Link>
    </div>
  );
}
