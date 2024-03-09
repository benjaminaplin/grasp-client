import { Application } from "./application"

export type Company = {
  id?: number
  userId: number | undefined
  name: string | null
  notes: string | null
  type: string | null
  jobApplications: Application[]
}