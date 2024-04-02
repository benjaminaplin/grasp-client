import { Application } from "./application"

export type Interview = {
  id?: number
  round: number | null
  notes: string | null
  type: string | null
  status: string|  null
  jobApplicationId: number | null
  jobApplication?: Application
  userId: number | null
  contactId: number | null
  applications: Application[]
}