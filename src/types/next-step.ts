import { Contact } from "./contact"

export type NextStep = {
  id?: number
  userId: number | undefined
  contactId: number | undefined
  action: string | null
  notes: string | null
  type: string | null
  contacts: Contact[] | undefined
}