export type ViewId =
  | 'overview'
  | 'accounts'
  | 'transactions'
  | 'statistics'
  | 'goals'
  | 'calculators'
  | 'profile'

export type AccountType = {
  id: string
  name: string
  icon: string
  balance: number
  trend: number // % month over month
  color: string
}

export const accounts: AccountType[] = [
  { id: 'savings', name: 'Epargne', icon: 'PiggyBank', balance: 3_450_000, trend: 4.2, color: 'var(--neon)' },
  { id: 'investment', name: 'Investissement', icon: 'TrendingUp', balance: 5_120_000, trend: 8.7, color: 'var(--teal)' },
  { id: 'entertainment', name: 'Divertissement', icon: 'Gamepad2', balance: 285_000, trend: -12.4, color: 'var(--gold)' },
  { id: 'emergency', name: 'Urgence', icon: 'ShieldCheck', balance: 1_800_000, trend: 2.1, color: 'var(--primary)' },
]

export const totalBalance = accounts.reduce((s, a) => s + a.balance, 0)
export const monthlyIncome = 1_450_000
export const monthlyExpenses = 842_500
export const savingsRate = Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100)

// Spending evolution — 6 months, one line per account type
export const spendingEvolution = [
  { month: 'Jan', savings: 2_800_000, investment: 3_900_000, entertainment: 210_000, emergency: 1_400_000 },
  { month: 'Feb', savings: 2_950_000, investment: 4_150_000, entertainment: 260_000, emergency: 1_480_000 },
  { month: 'Mar', savings: 3_100_000, investment: 4_400_000, entertainment: 240_000, emergency: 1_550_000 },
  { month: 'Apr', savings: 3_200_000, investment: 4_700_000, entertainment: 320_000, emergency: 1_640_000 },
  { month: 'May', savings: 3_350_000, investment: 4_950_000, entertainment: 300_000, emergency: 1_720_000 },
  { month: 'Jun', savings: 3_450_000, investment: 5_120_000, entertainment: 285_000, emergency: 1_800_000 },
]

export type Category = {
  name: string
  value: number
  color: string
  icon: string
}

export const expenseBreakdown: Category[] = [
  { name: 'Food & Groceries', value: 245_000, color: 'var(--neon)', icon: 'UtensilsCrossed' },
  { name: 'Transport', value: 168_000, color: 'var(--teal)', icon: 'Bus' },
  { name: 'Rent', value: 210_000, color: 'var(--primary)', icon: 'Home' },
  { name: 'Entertainment', value: 95_500, color: 'var(--gold)', icon: 'Clapperboard' },
  { name: 'Utilities', value: 124_000, color: '#8b9dc3', icon: 'Zap' },
]

export type Transaction = {
  id: string
  date: string
  category: string
  icon: string
  description: string
  account: string
  amount: number
  status: 'completed' | 'pending' | 'failed'
}

export const transactions: Transaction[] = [
  { id: 't1', date: '2026-07-21', category: 'Income', icon: 'ArrowDownLeft', description: 'Salary — TechCorp SA', account: 'Epargne', amount: 1_450_000, status: 'completed' },
  { id: 't2', date: '2026-07-20', category: 'Food', icon: 'UtensilsCrossed', description: 'Auchan Groceries', account: 'Divertisement', amount: -48_500, status: 'completed' },
  { id: 't3', date: '2026-07-19', category: 'Transport', icon: 'Bus', description: 'Yango rides', account: 'Divertisement', amount: -12_000, status: 'completed' },
  { id: 't4', date: '2026-07-18', category: 'Investment', icon: 'TrendingUp', description: 'Bond purchase', account: 'Investissement', amount: -350_000, status: 'completed' },
  { id: 't5', date: '2026-07-17', category: 'Rent', icon: 'Home', description: 'July apartment rent', account: 'Epargne', amount: -210_000, status: 'completed' },
  { id: 't6', date: '2026-07-16', category: 'Utilities', icon: 'Zap', description: 'SENELEC electricity', account: 'Epargne', amount: -34_000, status: 'pending' },
  { id: 't7', date: '2026-07-15', category: 'Entertainment', icon: 'Clapperboard', description: 'Canal+ subscription', account: 'Divertisement', amount: -25_000, status: 'completed' },
  { id: 't8', date: '2026-07-14', category: 'Transfer', icon: 'ArrowUpRight', description: 'Wave transfer to family', account: 'Urgence', amount: -75_000, status: 'failed' },
]

export type Goal = {
  id: string
  name: string
  icon: string
  current: number
  target: number
  daysRemaining: number
  color: string
}

export const goals: Goal[] = [
  { id: 'g1', name: 'New Laptop', icon: 'Laptop', current: 420_000, target: 750_000, daysRemaining: 62, color: 'var(--neon)' },
  { id: 'g2', name: 'Emergency Fund', icon: 'ShieldCheck', current: 1_800_000, target: 3_000_000, daysRemaining: 180, color: 'var(--teal)' },
  { id: 'g3', name: 'Trip to Cape Town', icon: 'Plane', current: 650_000, target: 1_200_000, daysRemaining: 95, color: 'var(--gold)' },
  { id: 'g4', name: 'Business Capital', icon: 'Briefcase', current: 2_100_000, target: 5_000_000, daysRemaining: 300, color: 'var(--primary)' },
]

// Statistics — different period datasets
export const statsData = {
  Daily: [
    { label: 'Mon', income: 0, expenses: 42_000 },
    { label: 'Tue', income: 0, expenses: 18_500 },
    { label: 'Wed', income: 0, expenses: 63_000 },
    { label: 'Thu', income: 1_450_000, expenses: 24_000 },
    { label: 'Fri', income: 0, expenses: 88_000 },
    { label: 'Sat', income: 0, expenses: 110_000 },
    { label: 'Sun', income: 0, expenses: 35_000 },
  ],
  Weekly: [
    { label: 'W1', income: 1_450_000, expenses: 220_000 },
    { label: 'W2', income: 120_000, expenses: 185_000 },
    { label: 'W3', income: 0, expenses: 240_000 },
    { label: 'W4', income: 80_000, expenses: 197_500 },
  ],
  Monthly: [
    { label: 'Jan', income: 1_380_000, expenses: 790_000 },
    { label: 'Feb', income: 1_410_000, expenses: 812_000 },
    { label: 'Mar', income: 1_450_000, expenses: 760_000 },
    { label: 'Apr', income: 1_520_000, expenses: 905_000 },
    { label: 'May', income: 1_450_000, expenses: 848_000 },
    { label: 'Jun', income: 1_450_000, expenses: 842_500 },
  ],
  Yearly: [
    { label: '2022', income: 12_400_000, expenses: 9_100_000 },
    { label: '2023', income: 14_800_000, expenses: 10_200_000 },
    { label: '2024', income: 16_200_000, expenses: 11_050_000 },
    { label: '2025', income: 17_400_000, expenses: 11_900_000 },
    { label: '2026', income: 8_730_000, expenses: 4_957_500 },
  ],
}

export const categoryStats = [
  { name: 'Food & Groceries', spent: 245_000, budget: 300_000, color: 'var(--neon)' },
  { name: 'Transport', spent: 168_000, budget: 150_000, color: 'var(--teal)' },
  { name: 'Rent', spent: 210_000, budget: 210_000, color: 'var(--primary)' },
  { name: 'Entertainment', spent: 95_500, budget: 120_000, color: 'var(--gold)' },
  { name: 'Utilities', spent: 124_000, budget: 130_000, color: '#8b9dc3' },
]
