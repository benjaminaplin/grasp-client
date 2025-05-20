import { Company } from '../types/company'

export const makeCompanyOptions = (companies: Company[]) => [
  { value: -1, label: 'Other (enter manually)' },
  ...(companies
    ?.sort((a, b) => {
      const nameA = a.name ?? ''
      const nameB = b.name ?? ''
      return nameA.localeCompare(nameB)
    })
    ?.map((c: Company) => ({ value: c.id, label: c.name })) || []),
  { value: 0, label: 'Please choose a company' },
]
