import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
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

export const Applications = () => {
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false)
  const [applicationCount, setApplicationCount] = useState(0)
  const { getAccessTokenSilently } = useAuth0()
  const [formState, setFormState] = useState<Application>({
    type: null,
    notes: null,
    role: null,
    userId: 2,
    companies: [],
    companyId: null,
    dateApplied: null,
    companyName: null,
  })
  const queryClient = useQueryClient()

  const { data: companies } = useQueryWrapper<Company[]>(
    'users/2/companies',
    undefined,
    { select: (fetchedData: Company[]) => orderBy(fetchedData, ['name']) },
  )
  const refreshJobApplications = () => {
    console.log('🚀 ~ refreshJobApplications ~ invalidateQueries:')
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
    console.log('evt.target.name', evt.target.name)
    console.log('evt.target.value', evt.target.value)
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
        refetchResource={refreshJobApplications}
        setIsFormOpen={() => setIsApplicationFormOpen(!isApplicationFormOpen)}
      />
      <ApplicationsTable />
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
