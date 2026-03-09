import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-white/[0.06] mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-2">
          Página no encontrada
        </h2>
        <p className="text-text-secondary mb-8">
          La página que buscás no existe o fue movida.
        </p>
        <Link href="/" className="btn-primary">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
