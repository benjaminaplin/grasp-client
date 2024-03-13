import { NextStep } from "./next-step"

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
}