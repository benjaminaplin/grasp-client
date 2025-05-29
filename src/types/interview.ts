import { Application } from './application'
import { Company } from './company'

export type Interview = {
  id?: number
  round: number | null
  notes: string | null
  type: string | null
  status: string | null
  jobApplicationId: number | null
  jobApplication?: Application & { company: Company }
  userId: number | null
  contactId: number | null
  applications: Application[]

  date: string | null
}
