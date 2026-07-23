import { Sprout } from 'lucide-react'

export function Logo({ showText = true }: { showText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-primary to-teal text-primary-foreground shadow-lg shadow-primary/20">
        <Sprout className="size-5" aria-hidden="true" />
      </div>
      {showText && (
        <span className="text-lg font-extrabold tracking-tight">
          Grow<span className="text-neon">Fi</span>
        </span>
      )}
    </div>
  )
}
