export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-nexivo-border bg-white px-6 py-12 text-center">
      <div className="mb-3 h-1 w-12 rounded-full bg-nexivo-stripe" />
      <h3 className="text-base font-semibold text-nexivo-ink">{title}</h3>
      {description && (
        <p className="mt-1 max-w-md text-sm text-nexivo-gray">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
