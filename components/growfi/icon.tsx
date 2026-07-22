import {
  ArrowDownLeft,
  ArrowUpRight,
  Bus,
  Briefcase,
  Calculator,
  Clapperboard,
  Gamepad2,
  Home,
  Laptop,
  LayoutDashboard,
  PiggyBank,
  Plane,
  ShieldCheck,
  Target,
  TrendingUp,
  UtensilsCrossed,
  User,
  Wallet,
  BarChart3,
  Receipt,
  Zap,
  type LucideIcon,
} from 'lucide-react'

const map: Record<string, LucideIcon> = {
  ArrowDownLeft,
  ArrowUpRight,
  Bus,
  Briefcase,
  Calculator,
  Clapperboard,
  Gamepad2,
  Home,
  Laptop,
  LayoutDashboard,
  PiggyBank,
  Plane,
  ShieldCheck,
  Target,
  TrendingUp,
  UtensilsCrossed,
  User,
  Wallet,
  BarChart3,
  Receipt,
  Zap,
}

export function Icon({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  const Cmp = map[name] ?? Wallet
  return <Cmp className={className} aria-hidden="true" />
}
