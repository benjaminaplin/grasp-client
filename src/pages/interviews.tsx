import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { InterviewsTable } from '../features/interview-table/InterviewTable'
import { Interview } from '../types/interview'
import Layout from '../components/layout/Layout'
import { InterviewForm } from '../features/interview-form/InterviewForm'
import { Company } from '../types/company'
import { Application } from '../types/application'
import { defaultHeaders, useQueryWrapper } from '../context/WrapUseQuery'
import { groupBy, orderBy } from 'lodash'
import { getBaseUrl } from '../service/getUrl'
import { TableToolBar } from '../components/table/table-tool-bar/TableToolBar'
import '../styles/table-style.css'
import dayjs from 'dayjs'

type CompanyMap = { [key: string]: Company[] }

export const Interviews = () => {
  const [isInterviewFormOpen, setIsInterviewFormOpen] = useState(false)
  const [formState, setFormState] = useState<Interview>({
    round: null,
    notes: null,
    type: null,
    status: null,
    jobApplicationId: null,
    userId: 2,
    contactId: null,
    applications: [],
    jobApplication: undefined,
    date: null,
  })

  const { mutate: mutateCreateInterview } = useMutation({
    mutationFn: (interview: Interview) => {
      return axios.post(
        `${getBaseUrl()}/interviews`,
        JSON.stringify(interview),
        {
          headers: defaultHeaders,
        },
      )
    },
    onSuccess: () => {
      setIsInterviewFormOpen(false)
      refetchInterviews()
    },
  })

  const { data: applications } =
    useQueryWrapper<Application[]>(`job-applications`)

  const {
    data: interviews,
    refetch: refetchInterviews,
    isLoading: interviewsAreLoading,
    isFetching: interviewsAreFetching,
  } = useQueryWrapper<Interview[]>(`interviews`)

  const { data: companyMap } = useQueryWrapper<Company[]>(
    'users/2/companies',
    undefined,
    {
      select: (fetchedData: Company[]) =>
        groupBy(
          orderBy(fetchedData, ['name']),
          (company: Company) => company.id,
        ),
    },
  )

  const { mutate: mutateUpdateInterview } = useMutation({
    mutationFn: ({
      interview,
      id,
    }: {
      interview: Partial<Interview>
      id: number
    }) => {
      return axios.patch(
        `${getBaseUrl()}/interviews/${id}`,
        JSON.stringify(interview),
        {
          headers: defaultHeaders,
        },
      )
    },
  })

  const createInterview = () => {
    mutateCreateInterview(formState)
  }

  const updateInterview = (updatedInterview: {
    interview: Partial<Interview>
    id: number
  }) => {
    mutateUpdateInterview(updatedInterview)
  }

  const handleFormChange = (evt: any) => {
    const targetName = evt.target?.name
    setFormState((formState: any) => {
      const name = !targetName
        ? 'scheduledDate'
        : targetName === 'applicationId'
          ? 'jobApplicationId'
          : targetName
      const dateTimeValue =
        !evt?.target && evt?.$d
          ? dayjs(new Date(evt.$d)).format('YYYY-MM-DD')
          : evt.$d
      const value = !targetName ? dateTimeValue : evt?.target?.value
      return { ...formState, [name]: value }
    })
  }

  return (
    <Layout title='Interviews'>
      <TableToolBar
        resource={interviews}
        resourceName='Interview'
        refetchResource={refetchInterviews}
        setIsFormOpen={() => setIsInterviewFormOpen(!isInterviewFormOpen)}
      />
      {companyMap && (
        <InterviewsTable
          interviewsAreLoading={interviewsAreLoading || interviewsAreFetching}
          companyMap={companyMap as unknown as CompanyMap}
          updateInterview={updateInterview}
          tableData={interviews}
          refreshTableData={refetchInterviews}
        />
      )}
      <InterviewForm
        interviewDate={formState.date}
        companyMap={companyMap as unknown as CompanyMap}
        applicationId={formState.applications[0]?.id}
        isOpen={isInterviewFormOpen}
        handleClose={() => setIsInterviewFormOpen(false)}
        createInterview={createInterview}
        handleFormChange={handleFormChange}
        applications={applications}
      />
    </Layout>
  )
}
