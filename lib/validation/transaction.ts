import { z } from "zod"

export const transactionSchema = z.object({
  accountId: z.string().min(1, "Le compte est requis"),
  amount: z.coerce.number().finite().positive("Le montant doit être supérieur à 0"),
  type: z.enum(["income", "expense"]),
  category: z.string().trim().min(1, "La catégorie est requise").max(80),
  description: z.string().trim().max(200).optional().nullable(),
  note: z.string().trim().max(1000).optional().nullable(),
  date: z.coerce.date().optional(),
  source: z.enum(["manual", "wave", "orange", "mtn"]).default("manual"),
})

export type TransactionInput = z.infer<typeof transactionSchema>
