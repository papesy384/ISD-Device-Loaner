export default function Loading() {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ background: "#f4f4f5", color: "#18181b" }}
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-isd-navy border-t-transparent"
          role="status"
          aria-label="Loading"
        />
        <span className="text-sm text-zinc-600">Loading…</span>
      </div>
    </div>
  );
}
