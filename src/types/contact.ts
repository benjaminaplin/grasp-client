import { Company } from "./company"
import { NextStep } from "./next-step"
import { Touch } from "./touch"

export type Contact = {
  id?: number
  userId: number | undefined
  firstName: string | null
  lastName: string | null
  title: string | null
  notes: string | null
  type: string | null
  closeness: 'A' | 'B' | 'C' | 'D' | 'E' | null
  nextSteps: NextStep[]
  companies: Company
  touches: Touch[]
  companyId: number | null
}