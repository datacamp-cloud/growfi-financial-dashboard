import { z } from "zod"

export const accountSchema = z.object({
  name: z.string().trim().min(1, "Le nom du compte est requis").max(80),
  type: z.string().trim().min(1, "Le type de compte est requis").max(40),
  icon: z.string().trim().min(1).max(40).optional(),
  color: z.string().trim().regex(/^#[0-9A-Fa-f]{6}$/, "La couleur doit être un hexadécimal valide").optional(),
})

export type AccountInput = z.infer<typeof accountSchema>
