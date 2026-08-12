export interface EmptyStateProps {
  title?: string;
  hint?: string;
}

export default function EmptyState({
  title = 'Nenhuma cidade encontrada',
  hint = 'Confira o nome informado e tente buscar novamente.',
}: EmptyStateProps) {
  return (
    <div
      aria-labelledby="empty-state-title"
      className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-6 text-center shadow-glass backdrop-blur-md"
      role="status"
    >
      <h2 className="text-lg font-semibold text-white" id="empty-state-title">
        {title}
      </h2>
      <p className="text-sm text-white/60">{hint}</p>
    </div>
  );
}
