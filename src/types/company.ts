import { Application } from "./application"
import { User } from "./user"

export type Company = {
  id?: number
  userId: number | undefined
  name: string | null
  notes: string | null
  type: string | null
  jobApplications: Application[]
  users: User[]
}