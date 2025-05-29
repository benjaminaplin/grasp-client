import axios from 'axios'
import { keepPreviousData, useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { CompanyTable } from '../features/company-table/CompanyTable'
import { Company } from '../types/company'
import Layout from '../components/layout/Layout'
import { CompanyForm } from '../features/company-form/CompanyForm'
import { defaultHeaders, useQueryWrapper } from '../context/WrapUseQuery'
import { getBaseUrl } from '../service/getUrl'
import { TableToolBar } from '../components/table/table-tool-bar/TableToolBar'
import { PaginatedResponse } from '../types/paginatedResponse'
import { usePagination } from '../hooks/usePagination'
import { useAuth0 } from '@auth0/auth0-react'

export const Companies = () => {
  const { getAccessTokenSilently } = useAuth0()
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
    mutationFn: async (company: Company) => {
      const token = await getAccessTokenSilently()
      return axios.post(`${getBaseUrl()}/companies`, JSON.stringify(company), {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
    },
    onSuccess: onMutateSuccess,
  })

  const { pagination, setPagination } = usePagination()

  const {
    data: companyData,
    refetch: refetchCompanies,
    isLoading: companiesAreLoading,
    isFetching: companiesAreFetching,
  } = useQueryWrapper<PaginatedResponse<Company>>(
    `companies`,
    undefined,
    { placeholderData: keepPreviousData }, // don't have 0 rows flash while changing pages/loading next page
    undefined,
    { page: pagination.pageIndex, limit: pagination.pageSize },
    undefined,
  )

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
      <TableToolBar
        resource={companyData?.data}
        resourceName='Company'
        resourceNamePlural='Companies'
        refetchResource={refetchCompanies}
        setIsFormOpen={() => setIsCompanyFormOpen(!isCompanyFormOpen)}
      />
      <CompanyTable
        companiesAreLoading={companiesAreLoading || companiesAreFetching}
        updateCompany={updateCompany}
        tableData={companyData}
        refreshTableData={refetchCompanies}
        deleteCompany={deleteCompany}
        setPagination={setPagination}
        pagination={pagination}
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
