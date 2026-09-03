import { z } from "zod"

export const goalSchema = z.object({
  name: z.string().trim().min(1, "Le nom de l'objectif est requis").max(100),
  icon: z.string().trim().min(1).max(40).optional(),
  targetAmount: z.coerce.number().finite().positive("Le montant cible doit être supérieur à 0"),
  currentAmount: z.coerce.number().finite().min(0, "Le montant actuel ne peut pas être négatif").optional(),
  color: z.string().trim().regex(/^#[0-9A-Fa-f]{6}$/, "La couleur doit être un hexadécimal valide").optional(),
  deadline: z.coerce.date().optional().nullable(),
}).refine((data) => (data.currentAmount ?? 0) <= data.targetAmount, {
  message: "Le montant actuel ne peut pas dépasser la cible",
  path: ["currentAmount"],
})

export type GoalInput = z.infer<typeof goalSchema>
