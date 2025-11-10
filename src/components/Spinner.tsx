export default function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <span
        className="h-12 w-12 animate-spin rounded-full border-4 border-accent/40 border-t-primary"
        role="status"
        aria-label="Loading"
      />
    </div>
  )
}


