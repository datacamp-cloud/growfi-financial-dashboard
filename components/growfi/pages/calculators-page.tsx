'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '../shared'
import { CompoundCalculator } from '../calculators/compound-calculator'
import { DebtCalculator } from '../calculators/debt-calculator'
import { ProjectionCalculator } from '../calculators/projection-calculator'
import { LineChart, PiggyBank, Landmark } from 'lucide-react'

export function CalculatorsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Calculateur"
        subtitle="Planifie tes investissements, dettes, et ton futur financier."
      />

      <Tabs defaultValue="compound" className="gap-6">
        <TabsList variant="line" className="w-full flex-wrap justify-start gap-2 border-b border-border pb-0">
          <TabsTrigger value="compound" className="flex-none gap-2">
            <PiggyBank />
            Croissance d'Investissement
          </TabsTrigger>
          <TabsTrigger value="debt" className="flex-none gap-2">
            <Landmark />
            Amortissement de dette
          </TabsTrigger>
          <TabsTrigger value="projection" className="flex-none gap-2">
            <LineChart />
            Projection de Croissance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compound">
          <CompoundCalculator />
        </TabsContent>
        <TabsContent value="debt">
          <DebtCalculator />
        </TabsContent>
        <TabsContent value="projection">
          <ProjectionCalculator />
        </TabsContent>
      </Tabs>
    </div>
  )
}
