import { Application } from "./application"
import { Company } from "./company"
import { Contact } from "./contact"
import { NextStep } from "./next-step"

export type Touch = {
  id?: number
  type?: string | null
  notes?: string | null
  userId?: number | undefined
  contactId?: number | null
  nextStep?: NextStep | null
  jobApplication?: Application | null
  company?: Company | null
  contact?: Contact
  jobApplicationId?: string
  isNextStep?: boolean
  isCompleted?: boolean
  scheduledDate?: string | null
}