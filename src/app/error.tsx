"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="panel empty" role="alert">
      <h1>Algo no salió como esperábamos</h1>
      <p>Intentá volver a abrir esta pantalla.</p>
      <button className="button primary" onClick={reset}>
        Reintentar
      </button>
    </div>
  );
}
