import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import Button from '@mui/material/Button'
import { useState } from 'react'
import { CompanyTable } from '../features/company-table/CompanyTable'
import { Company } from '../types/company'
import Layout from '../components/layout/Layout'
import { CompanyForm } from '../features/company-form/CompanyForm'
import { defaultHeaders, useQueryWrapper } from '../context/WrapUseQuery'
import { getBaseUrl } from '../service/getUrl'

export const Companies = () => {
  const [isCompanyFormOpen, setIsCompanyFormOpen] = useState(false)
  const [formState, setFormState] = useState<Company>({
    name: null,
    type: null,
    notes: null,
    userId: 2,
    jobApplications: [],
    users: [],
  })

  const onMutateSuccess = () => {
    setIsCompanyFormOpen(false)
    refetchCompanies()
  }

  const { mutate: mutateCreateCompany } = useMutation({
    mutationFn: (company: Company) => {
      return axios.post(`${getBaseUrl()}/companies`, JSON.stringify(company), {
        headers: defaultHeaders,
      })
    },
    onSuccess: onMutateSuccess,
  })

  const {
    data,
    refetch: refetchCompanies,
    isLoading: companiesAreLoading,
    isFetching: companiesAreFetching,
  } = useQueryWrapper<Company[]>('users/2/companies')

  const { mutate: mutateDeleteCompany } = useMutation({
    mutationFn: (companyId: number) => {
      return axios.delete(`${getBaseUrl()}/companies/${companyId}`, {
        headers: defaultHeaders,
      })
    },
    onSuccess: onMutateSuccess,
  })

  const { mutate: mutateUpdateCompany } = useMutation({
    mutationFn: ({
      company,
      id,
    }: {
      company: Partial<Company>
      id: number
    }) => {
      return axios.patch(
        `${getBaseUrl()}/companies/${id}`,
        JSON.stringify(company),
        {
          headers: defaultHeaders,
        },
      )
    },
  })

  const createCompany = () => {
    mutateCreateCompany(formState)
  }

  const updateCompany = (updatedCompany: {
    company: Partial<Company>
    id: number
  }) => {
    mutateUpdateCompany(updatedCompany)
  }

  const handleFormChange = (evt: any) => {
    setFormState((formState: any) => ({
      ...formState,
      [evt.target.name]: evt.target.value,
    }))
  }

  const deleteCompany = (companyId: number) => {
    mutateDeleteCompany(companyId)
  }

  return (
    <Layout title='Companies'>
      <Button
        color='info'
        variant='contained'
        onClick={() => setIsCompanyFormOpen(!isCompanyFormOpen)}
      >
        Add Company
      </Button>
      <Button style={{ marginLeft: '1rem' }} onClick={() => refetchCompanies()}>
        Refresh Data
      </Button>
      <CompanyTable
        companiesAreLoading={companiesAreLoading || companiesAreFetching}
        updateCompany={updateCompany}
        tableData={data}
        refreshTableData={refetchCompanies}
        deleteCompany={deleteCompany}
      />
      <CompanyForm
        isOpen={isCompanyFormOpen}
        handleClose={() => setIsCompanyFormOpen(false)}
        createCompany={createCompany}
        handleFormChange={handleFormChange}
      />
    </Layout>
  )
}
