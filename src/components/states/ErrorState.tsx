export interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export default function ErrorState({
  message = 'Não foi possível carregar os dados do clima',
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      aria-live="assertive"
      className="flex min-h-40 flex-col items-center justify-center gap-4 rounded-2xl border border-red-300/20 bg-red-950/20 p-6 text-center shadow-glass backdrop-blur-md"
      role="alert"
    >
      <p className="text-sm font-medium text-red-100">{message}</p>
      <button
        className="min-h-11 rounded-xl border border-red-200/30 bg-red-100/10 px-5 font-semibold text-red-50 transition hover:bg-red-100/20 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-2 focus:ring-offset-night-900"
        onClick={onRetry}
        type="button"
      >
        Tentar novamente
      </button>
    </div>
  );
}
