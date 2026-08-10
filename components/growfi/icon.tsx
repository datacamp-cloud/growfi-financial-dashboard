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
  Bell,
  Car,
  GraduationCap,
  Heart,
  Shirt,
  ShoppingCart,
  Smartphone,
  Umbrella,
  Globe,
  Trophy,
  House,
  Palmtree,
  Dumbbell,
  Baby,
  Banknote,
  CircleDollarSign,
  TrendingDown,
  type LucideIcon,
} from 'lucide-react'

const map: Record<string, LucideIcon> = {
  // Navigation
  ArrowDownLeft,
  ArrowUpRight,
  LayoutDashboard,
  BarChart3,
  Receipt,
  Target,
  User,
  Wallet,
  // Catégories de transactions
  UtensilsCrossed,  // Alimentation
  Bus,              // Transport
  Home,             // Logement
  Heart,            // Santé
  GraduationCap,    // Éducation
  Clapperboard,     // Divertissement
  Shirt,            // Vêtements
  PiggyBank,        // Épargne
  TrendingUp,       // Investissement
  Briefcase,        // Salaire
  Laptop,           // Freelance
  ShoppingCart,     // Courses
  Smartphone,       // Téléphonie
  Car,              // Voiture
  Zap,              // Énergie
  // Goals
  Plane,            // Voyage
  House,            // Immobilier
  Trophy,           // Objectif général
  Globe,            // International
  Dumbbell,         // Sport/Santé
  Baby,             // Famille
  Gamepad2,         // Loisirs
  Palmtree,         // Vacances
  // Autres
  Bell,
  Calculator,
  ShieldCheck,
  Banknote,
  CircleDollarSign,
  TrendingDown,
  Umbrella,
}

export type IconName = keyof typeof map

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