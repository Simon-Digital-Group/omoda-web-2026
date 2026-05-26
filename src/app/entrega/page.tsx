import EntregaForm from "./EntregaForm";

export default function EntregaPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-16 sm:py-24">
      <header className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.2em] text-text-secondary">
          OMODA | JAECOO Uruguay
        </p>
        <h1 className="font-display text-3xl font-medium sm:text-4xl">
          Entrega de vehículo
        </h1>
        <p className="text-sm text-text-secondary sm:text-base">
          Completá los datos del cliente para registrar la entrega.
        </p>
      </header>
      <EntregaForm />
    </div>
  );
}
