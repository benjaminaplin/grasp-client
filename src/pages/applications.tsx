import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { ApplicationsTable } from '../features/application-table/ApplicationTable'
import { Application } from '../types/application'
import Layout from '../components/layout/Layout'
import { ApplicationForm } from '../features/application-form/ApplicationForm'
import { Company } from '../types/company'
import { defaultHeaders, useQueryWrapper } from '../context/WrapUseQuery'
import { orderBy } from 'lodash'
import { getBaseUrl } from '../service/getUrl'
import { TableToolBar } from '../components/table/table-tool-bar/TableToolBar'

export const Applications = () => {
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false)
  const [applicationCount, setApplicationCount] = useState(0)

  const [formState, setFormState] = useState<Application>({
    type: null,
    notes: null,
    role: null,
    userId: 2,
    companies: [],
    companyId: null,
    dateApplied: null,
  })
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
  const onMutateSuccess = () => {
    // setIsApplicationFormOpen(false)
    refetchApplications()
  }

  // const updateApplication = (updatedapplication: {
  //   application: Partial<Application>
  //   id: number
  // }) => {
  //   mutateUpdateApplication(updatedapplication)
  // }
  // const { mutate: mutateCreateapplication } = useMutation({
  //   mutationFn: (application: Application) => {
  //     return axios.post(
  //       `${getBaseUrl()}/job-applications`,
  //       JSON.stringify(application),
  //       {
  //         headers: defaultHeaders,
  //       },
  //     )
  //   },
  //   onSuccess: () => {
  //     setIsApplicationFormOpen(false)
  //     // refetchApplications()
  //   },
  // })

  const { data: companies } = useQueryWrapper<Company[]>(
    'users/2/companies',
    undefined,
    { select: (fetchedData: Company[]) => orderBy(fetchedData, ['name']) },
  )

  const createApplication = () => {
    mutateCreateapplication(formState)
  }

  const handleFormChange = (evt: any) => {
    setFormState((formState: any) => ({
      ...formState,
      [evt.target.name]: evt.target.value,
    }))
  }

  return (
    <Layout title='Applications'>
      <TableToolBar
        resource={undefined}
        resourceCount={applicationCount}
        resourceName='Application'
        refetchResource={() => {}}
        setIsFormOpen={() => setIsApplicationFormOpen(!isApplicationFormOpen)}
      />
      <ApplicationsTable
        companies={companies}
        handleUpdateRowCount={setApplicationCount}
      />
      <ApplicationForm
        companyId={formState.companies[0]?.id}
        isOpen={isApplicationFormOpen}
        handleClose={() => setIsApplicationFormOpen(false)}
        createApplication={createApplication}
        handleFormChange={handleFormChange}
        companies={companies}
      />
    </Layout>
  )
}
