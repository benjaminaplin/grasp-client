import axios from 'axios'
import { keepPreviousData, useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { ApplicationsTable } from '../features/application-table/ApplicationTable'
import { Application } from '../types/application'
import Layout from '../components/layout/Layout'
import { ApplicationForm } from '../features/application-form/ApplicationForm'
import { Company } from '../types/company'
import {
  defaultHeaders,
  fetcher,
  useQueryWrapper,
} from '../context/WrapUseQuery'
import { orderBy } from 'lodash'
import { getBaseUrl } from '../service/getUrl'
import { TableToolBar } from '../components/table/table-tool-bar/TableToolBar'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { JOB_APPLICATIONS_KEY } from '../constants/queryKeys'
import { usePagination } from '../hooks/usePagination'
import { PaginatedResponse } from '../types/paginatedResponse'

export const Applications = () => {
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false)
  const [applicationCount, setApplicationCount] = useState(0)
  const { getAccessTokenSilently } = useAuth0()
  const [formState, setFormState] = useState<Application>({
    type: null,
    notes: null,
    role: null,
    userId: 2,
    companyId: null,
    dateApplied: null,
    companyName: null,
    link: null,
    status: null,
    description: null,
  })
  const queryClient = useQueryClient()

  const { pagination, setPagination } = usePagination()

  const {
    data: tableData,
    refetch: refetchApplications,
    isLoading: applicationsAreLoading,
    isFetching: applicationsAreFetching,
  } = useQueryWrapper<PaginatedResponse<Application>>(
    `job-applications`,
    undefined,
    { placeholderData: keepPreviousData }, // don't have 0 rows flash while changing pages/loading next page
    undefined,
    { page: pagination.pageIndex, limit: pagination.pageSize },
    undefined,
  )

  const { data: companies } = useQueryWrapper<Company[]>(
    `users/2/companies`,
    undefined,
    { placeholderData: keepPreviousData }, // don't have 0 rows flash while changing pages/loading next page
    undefined,
    undefined,
    undefined,
  )
  console.log('🚀 ~ Applications ~ companies:', companies)

  const refreshJobApplications = () => {
    queryClient.invalidateQueries({ queryKey: [JOB_APPLICATIONS_KEY] })
  }
  const { mutate: mutateCreateApplication } = useMutation({
    mutationFn: async (application: Application) => {
      const payload = application
      if (application.companyId === -1) {
        delete payload.companyId
      }
      const token = await getAccessTokenSilently()
      return axios.post(
        `${getBaseUrl()}/job-applications`,
        JSON.stringify(payload),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )
    },
    onSuccess: () => {
      refreshJobApplications()
      setIsApplicationFormOpen(false)
    },
  })

  const createApplication = () => {
    mutateCreateApplication(formState)
  }

  const handleFormChange = (evt: any) => {
    setFormState((formState: any) => {
      return { ...formState, [evt.target.name]: evt.target.value }
    })
  }

  return (
    <Layout title='Applications'>
      <TableToolBar
        resource={undefined}
        resourceCount={applicationCount}
        resourceName='Application'
        refetchResource={refetchApplications}
        setIsFormOpen={() => setIsApplicationFormOpen(!isApplicationFormOpen)}
      />
      <ApplicationsTable
        setPagination={setPagination}
        pagination={pagination}
        tableData={tableData}
        isLoading={applicationsAreLoading}
      />
      <ApplicationForm
        companyId={formState.companyId}
        companyName={formState.companyName}
        isOpen={isApplicationFormOpen}
        handleClose={() => setIsApplicationFormOpen(false)}
        createApplication={createApplication}
        handleFormChange={handleFormChange}
        companies={companies}
      />
    </Layout>
  )
}
