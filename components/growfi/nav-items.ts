import type { ViewId } from '@/lib/data'

export type NavItem = {
  id: ViewId
  label: string
  icon: string
}

export const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
  { id: 'accounts', label: 'Accounts', icon: 'Wallet' },
  { id: 'transactions', label: 'Transactions', icon: 'Receipt' },
  { id: 'statistics', label: 'Statistics', icon: 'BarChart3' },
  { id: 'goals', label: 'Goals', icon: 'Target' },
  { id: 'calculators', label: 'Calculators', icon: 'Calculator' },
  { id: 'profile', label: 'Profile', icon: 'User' },
]

// Mobile bottom nav: Home, Stats, +, Goals, Profile
export const mobileNavItems: (NavItem | { id: 'add'; label: string; icon: string })[] = [
  { id: 'overview', label: 'Home', icon: 'LayoutDashboard' },
  { id: 'statistics', label: 'Stats', icon: 'BarChart3' },
  { id: 'add', label: 'Add', icon: 'ArrowUpRight' },
  { id: 'goals', label: 'Goals', icon: 'Target' },
  { id: 'profile', label: 'Profile', icon: 'User' },
]
