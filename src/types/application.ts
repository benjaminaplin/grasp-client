import { Company } from "./company"

export type Application = {
  id?: number
  type: number | null
  role: string | null
  notes: string | null
  userId: number | null
  companies: Company[]
}