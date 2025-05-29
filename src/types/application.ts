import { Company } from './company'
import { Interview } from './interview'
import { NextStep } from './next-step'

export type Application = {
  id: number
  type: string | null
  role: string | null
  notes: string | null
  userId: number
  link: string | null
  dateApplied: string | null
  status: string | null
  description: string | null
  nextsteps: NextStep[] | null
  companyId: number | null
  company: Company | undefined
  contacts: any[] // Replace with a Contact[] type if available
  Interview: Interview[]
  Touch: any[] // Replace with a Touch[] type if available
}
