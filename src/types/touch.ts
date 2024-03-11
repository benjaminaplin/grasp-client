import { Application } from "./application"
import { Company } from "./company"
import { NextStep } from "./next-step"

export type Touch = {
  id?: number
  userId: number | undefined
  contactId: number | undefined
  title: string | null
  notes: string | null
  type: string | null
  NextStep: NextStep
  JobApplication: Application
  Company: Company
}
