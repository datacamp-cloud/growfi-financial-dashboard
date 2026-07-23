import type { ViewId } from '@/lib/data'

export type NavItem = {
  id: ViewId
  label: string
  icon: string
  href: string
}

export const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: 'LayoutDashboard', href: '/' },
  { id: 'accounts', label: 'Accounts', icon: 'Wallet', href: '/accounts' },
  { id: 'transactions', label: 'Transactions', icon: 'Receipt', href: '/transactions' },
  { id: 'statistics', label: 'Statistics', icon: 'BarChart3', href: '/statistics' },
  { id: 'goals', label: 'Goals', icon: 'Target', href: '/goals' },
  { id: 'calculators', label: 'Calculators', icon: 'Calculator', href: '/calculators' },
  { id: 'profile', label: 'Profile', icon: 'User', href: '/profile' },
]

// Mobile bottom nav: Home, Stats, +, Goals, Profile
export const mobileNavItems: (NavItem | { id: 'add'; label: string; icon: string, href: string })[] = [
  { id: 'overview', label: 'Home', icon: 'LayoutDashboard', href: '/' },
  { id: 'statistics', label: 'Stats', icon: 'BarChart3', href: '/statistics' },
  { id: 'add', label: 'Add', icon: 'ArrowUpRight', href: '/add' },
  { id: 'goals', label: 'Goals', icon: 'Target', href: '/goals' },
  { id: 'profile', label: 'Profile', icon: 'User', href: '/profile' },
  { id: 'transactions', label: 'Transactions', icon: 'Receipt', href: '/transactions' },
]
