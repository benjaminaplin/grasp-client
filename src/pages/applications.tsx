import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import Button from '@mui/material/Button'
import { useState } from 'react'
import { ApplicationsTable } from '../features/application-table/ApplicationTable'
import { Application } from '../types/application'
import Layout from '../components/layout/Layout'
import { ApplicationForm } from '../features/application-form/ApplicationForm'
import { Company } from '../types/company'
import { defaultHeaders, useQueryWrapper } from '../context/WrapUseQuery'
import { orderBy } from 'lodash'
import { getBaseUrl } from '../service/getUrl'

export const Applications = () => {
  const [isapplicationFormOpen, setIsapplicationFormOpen] = useState(false)
  const [formState, setFormState] = useState<Application>({
    type: null,
    notes: null,
    role: null,
    userId: 3,
    companies: [],
    companyId: null,
    dateApplied: null,
  })

  const { mutate: mutateCreateapplication } = useMutation({
    mutationFn: (application: Application) => {
      return axios.post(
        `${getBaseUrl()}/job-applications`,
        JSON.stringify(application),
        {
          headers: defaultHeaders,
        },
      )
    },
    onSuccess: () => {
      setIsapplicationFormOpen(false)
      refetchApplications()
    },
  })

  const { data: companies } = useQueryWrapper<Company[]>(
    'companies',
    undefined,
    { select: (fetchedData: Company[]) => orderBy(fetchedData, ['name']) },
  )

  const {
    data: applications,
    refetch: refetchApplications,
    isLoading: areApplicationsLoading,
    isFetching: areApplicationsFetching,
  } = useQueryWrapper<Application[]>('job-applications')

  const { mutate: mutateUpdateApplication } = useMutation({
    mutationFn: ({
      application,
      id,
    }: {
      application: Partial<Application>
      id: number
    }) => {
      return axios.patch(
        `${getBaseUrl()}/job-applications/${id}`,
        JSON.stringify(application),
        {
          headers: defaultHeaders,
        },
      )
    },
  })

  const createApplication = () => {
    mutateCreateapplication(formState)
  }

  const updateApplication = (updatedapplication: {
    application: Partial<Application>
    id: number
  }) => {
    mutateUpdateApplication(updatedapplication)
  }

  const handleFormChange = (evt: any) => {
    setFormState((formState: any) => ({
      ...formState,
      [evt.target.name]: evt.target.value,
    }))
  }
  const applicationTableData = applications?.map((a: Application) => ({
    ...a,
    company:
      companies?.find((c: Company) => c.id === a.companyId)?.name || null,
  }))

  return (
    <Layout title='Applications'>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          marginLeft: '1rem',
        }}
      >
        <Button
          color='info'
          variant='contained'
          onClick={() => setIsapplicationFormOpen(!isapplicationFormOpen)}
        >
          Add application
        </Button>
        <Button
          style={{ marginLeft: '1rem' }}
          onClick={() => refetchApplications()}
        >
          Refresh Data
        </Button>
        <div>Applications: {`${applications?.length || 0}`}</div>
      </div>
      <ApplicationsTable
        areApplicationsLoading={
          areApplicationsLoading || areApplicationsFetching
        }
        updateApplication={updateApplication}
        tableData={applicationTableData}
        refreshTableData={refetchApplications}
      />
      <ApplicationForm
        companyId={formState.companies[0]?.id}
        isOpen={isapplicationFormOpen}
        handleClose={() => setIsapplicationFormOpen(false)}
        createApplication={createApplication}
        handleFormChange={handleFormChange}
        companies={companies}
      />
    </Layout>
  )
}
