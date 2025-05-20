import { NextStep } from './next-step'

export type Application = {
  id?: number
  type: string | null
  role: string | null
  notes: string | null
  link: string | null
  status: string | null
  description: string | null
  userId: number | null
  companyId?: number | null
  dateApplied: string | null
  companyName: string | null
  created_at?: string | null
  nextSteps?: NextStep[]
  touches?: Touch[]
}
