import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import Button from '@mui/material/Button'
import { useState } from 'react'
import { NextStepTable } from '../features/next-step-table/NextStepTable'
import { NextStep } from '../types/next-step'
import Layout from '../components/layout/Layout'
import { NextStepForm } from '../features/next-step-form/NextStepForm'
import { Contact } from '../types/contact'
import { defaultHeaders, useQueryWrapper } from '../context/WrapUseQuery'
import { orderBy } from 'lodash'
import dayjs from 'dayjs'
import { getBaseUrl } from '../service/getUrl'

export default function ButtonUsage() {
  return <Button variant='contained'>Hello world</Button>
}

export const NextSteps = () => {
  const [isNextStepFormOpen, setIsNextStepFormOpen] = useState(false)
  const [formState, setFormState] = useState<NextStep>({
    type: null,
    notes: null,
    userId: 2,
    contactId: undefined,
    action: null,
    contacts: [],
    completed: false,
    dueDate: undefined,
  })

  const {
    data: nextSteps,
    refetch: refetchNextSteps,
    isLoading: areNextStepsLoading,
    isFetching: areNextStepsFetching,
  } = useQueryWrapper<NextStep[]>(`next-steps`)

  const onMutateSuccess = () => {
    setIsNextStepFormOpen(false)
    refetchNextSteps()
  }

  const { mutate: mutateCreateNextStep } = useMutation({
    mutationFn: (nextStep: NextStep) => {
      return axios.post(
        `${getBaseUrl()}/next-steps`,
        JSON.stringify(nextStep),
        {
          headers: defaultHeaders,
        },
      )
    },
    onSuccess: onMutateSuccess,
  })

  const { data: contacts } = useQueryWrapper<Contact[]>(`contacts`, undefined, {
    select: (fetchedData: NextStep[]) => orderBy(fetchedData, ['firstName']),
  })

  const { mutate: mutateDeleteNextStep } = useMutation({
    mutationFn: (nextStepId: number) => {
      return axios.delete(`${getBaseUrl()}/next-steps/${nextStepId}`, {
        headers: defaultHeaders,
      })
    },
    onSuccess: onMutateSuccess,
  })

  const { mutate: mutateUpdateNextStep } = useMutation({
    mutationFn: ({
      nextStep,
      id,
    }: {
      nextStep: Partial<NextStep>
      id: number
    }) => {
      return axios.put(
        `${getBaseUrl()}/next-steps/${id}`,
        JSON.stringify(nextStep),
        {
          headers: defaultHeaders,
        },
      )
    },
  })

  const createNextStep = () => {
    mutateCreateNextStep(formState)
  }

  const updateNextStep = (updatedNextStep: {
    nextStep: Partial<NextStep>
    id: number
  }) => {
    mutateUpdateNextStep(updatedNextStep)
  }

  const handleFormChange = (evt: any) => {
    const targetName = evt.target?.name
    setFormState((formState: any) => {
      const name = !targetName ? 'dueDate' : targetName
      const dateTimeValue =
        !evt?.target && evt?.$d
          ? dayjs(new Date(evt.$d)).format('YYYY-MM-DD')
          : evt.$d
      const value = !targetName ? dateTimeValue : evt?.target?.value
      return { ...formState, [name]: value }
    })
  }

  const deleteNextStep = (nextStepId: number) => {
    mutateDeleteNextStep(nextStepId)
  }

  const nextStepTableData = nextSteps?.map((a: NextStep) => {
    const contact = contacts?.find((c: Contact) => c.id === a.contactId)
    return {
      ...a,
      contact: contact ? `${contact?.firstName} ${contact?.lastName}` : null,
    }
  })

  return (
    <Layout title='Next Steps'>
      <Button
        color='info'
        variant='contained'
        onClick={() => setIsNextStepFormOpen(!isNextStepFormOpen)}
      >
        Add next step
      </Button>
      <Button style={{ marginLeft: '1rem' }} onClick={() => refetchNextSteps()}>
        Refresh Data
      </Button>
      <NextStepTable
        areNextStepsLoading={areNextStepsLoading || areNextStepsFetching}
        updateNextStep={updateNextStep}
        tableData={nextStepTableData}
        refreshTableData={refetchNextSteps}
        deleteNextStep={deleteNextStep}
      />
      <NextStepForm
        dueDate={formState.dueDate}
        contactId={formState.contacts?.[0]?.id}
        isOpen={isNextStepFormOpen}
        handleClose={() => setIsNextStepFormOpen(false)}
        createNextStep={createNextStep}
        handleFormChange={handleFormChange}
        contacts={contacts}
      />
    </Layout>
  )
}
