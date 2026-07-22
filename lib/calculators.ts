export type CompoundFreq = 'monthly' | 'quarterly' | 'annually'

export type CompoundRow = {
  year: number
  contributed: number
  interest: number
  balance: number
}

export function computeCompound(opts: {
  initial: number
  monthly: number
  annualRate: number
  years: number
  freq: CompoundFreq
}): { rows: CompoundRow[]; final: number; contributed: number; interest: number } {
  const { initial, monthly, annualRate, years, freq } = opts
  const r = annualRate / 100
  const perYear = freq === 'monthly' ? 12 : freq === 'quarterly' ? 4 : 1
  const monthsPerPeriod = 12 / perYear

  let balance = initial
  let contributed = initial
  const rows: CompoundRow[] = []
  const totalMonths = Math.round(years * 12)

  for (let m = 1; m <= totalMonths; m++) {
    balance += monthly
    contributed += monthly
    if (m % monthsPerPeriod === 0) {
      balance += balance * (r / perYear)
    }
    if (m % 12 === 0) {
      rows.push({
        year: m / 12,
        contributed: Math.round(contributed),
        interest: Math.round(balance - contributed),
        balance: Math.round(balance),
      })
    }
  }

  return {
    rows,
    final: Math.round(balance),
    contributed: Math.round(contributed),
    interest: Math.round(balance - contributed),
  }
}

export type AmortRow = {
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
}

export function computeAmortization(opts: {
  loan: number
  annualRate: number
  months: number
}): { payment: number; totalRepaid: number; totalInterest: number; schedule: AmortRow[] } {
  const { loan, annualRate, months } = opts
  const r = annualRate / 100 / 12
  const payment = r === 0 ? loan / months : (loan * r) / (1 - Math.pow(1 + r, -months))

  let balance = loan
  const schedule: AmortRow[] = []
  for (let m = 1; m <= months; m++) {
    const interest = balance * r
    const principal = payment - interest
    balance = Math.max(0, balance - principal)
    schedule.push({
      month: m,
      payment: Math.round(payment),
      principal: Math.round(principal),
      interest: Math.round(interest),
      balance: Math.round(balance),
    })
  }

  const totalRepaid = payment * months
  return {
    payment: Math.round(payment),
    totalRepaid: Math.round(totalRepaid),
    totalInterest: Math.round(totalRepaid - loan),
    schedule,
  }
}

export type ProjectionRow = {
  year: number
  income: number
  expenses: number
  savings: number
  invested: number
  netWorth: number
}

export function computeProjection(opts: {
  monthlyIncome: number
  monthlyExpenses: number
  savingsTargetPct: number
  incomeGrowthPct: number
  returnPct: number
  years: number
}): { rows: ProjectionRow[]; finalNetWorth: number; fiScore: number; yearsToFi: number | null } {
  const { monthlyIncome, monthlyExpenses, savingsTargetPct, incomeGrowthPct, returnPct, years } = opts

  const rows: ProjectionRow[] = []
  let income = monthlyIncome * 12
  let expenses = monthlyExpenses * 12
  let netWorth = 0
  let yearsToFi: number | null = null

  for (let y = 1; y <= years; y++) {
    const annualSavings = Math.max(0, (income * savingsTargetPct) / 100)
    netWorth = netWorth * (1 + returnPct / 100) + annualSavings
    const fiTarget = expenses * 25 // 4% rule
    if (yearsToFi === null && netWorth >= fiTarget) yearsToFi = y

    rows.push({
      year: y,
      income: Math.round(income),
      expenses: Math.round(expenses),
      savings: Math.round(annualSavings),
      invested: Math.round(netWorth),
      netWorth: Math.round(netWorth),
    })

    income = income * (1 + incomeGrowthPct / 100)
    expenses = expenses * (1 + Math.min(incomeGrowthPct, 4) / 200 + 0.02) // mild inflation
  }

  const finalExpenses = rows[rows.length - 1]?.expenses ?? expenses
  const fiScore = Math.min(100, Math.round((netWorth / (finalExpenses * 25)) * 100))

  return { rows, finalNetWorth: Math.round(netWorth), fiScore, yearsToFi }
}
