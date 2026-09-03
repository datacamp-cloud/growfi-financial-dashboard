import { z } from "zod"

export const transactionSchema = z.object({
  accountId: z.string().min(1, "Le compte source est requis"),
  relatedAccountId: z.string().min(1, "Le compte destination est requis").optional().nullable(),
  amount: z.coerce.number().finite().positive("Le montant doit être supérieur à 0"),
  type: z.enum(["income", "expense", "transfer"]),
  category: z.string().trim().min(1, "La catégorie est requise").max(80),
  description: z.string().trim().max(200).optional().nullable(),
  note: z.string().trim().max(1000).optional().nullable(),
  date: z.coerce.date().optional(),
  source: z.enum(["manual", "wave", "orange", "mtn"]).default("manual"),
}).superRefine((data, ctx) => {
  if (data.type === "transfer" && !data.relatedAccountId) {
    ctx.addIssue({ code: "custom", path: ["relatedAccountId"], message: "Le compte destination est requis pour un transfert" })
  }
  if (data.type === "transfer" && data.relatedAccountId === data.accountId) {
    ctx.addIssue({ code: "custom", path: ["relatedAccountId"], message: "La destination doit être différente du compte source" })
  }
})

export type TransactionInput = z.infer<typeof transactionSchema>
