import { Company } from "./company"

export type Application = {
  id?: number
  type: string | null
  role: string | null
  notes: string | null
  userId: number | null
  companyId: number | null
  companies: Company[]
  dateApplied: string
}