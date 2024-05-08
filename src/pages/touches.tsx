import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { TouchesTable } from '../features/touch-table/TouchTable'
import { Touch } from '../types/touch'
import Layout from '../components/layout/Layout'
import { TouchForm } from '../features/touch-form/TouchForm'
import { Application } from '../types/application'
import dayjs from 'dayjs'
import { defaultHeaders, useQueryWrapper } from '../context/WrapUseQuery'
import { Contact } from '../types/contact'
import { getBaseUrl } from '../service/getUrl'
import { TableToolBar } from '../components/table/table-tool-bar/TableToolBar'

export const Touches = () => {
  const [isTouchFormOpen, setIsTouchFormOpen] = useState(false)
  const [formState, setFormState] = useState<Partial<Touch>>({
    notes: null,
    type: null,
    contactId: undefined,
    nextStep: null,
    jobApplicationId: undefined,
    userId: 3,
    scheduledDate: null,
  })
  const { mutate: mutateCreateTouch } = useMutation({
    mutationFn: (touch: Touch) => {
      return axios.post(`${getBaseUrl()}/touches`, JSON.stringify(touch), {
        headers: defaultHeaders,
      })
    },
    onSuccess: () => {
      setIsTouchFormOpen(false)
      refetchTouches()
    },
  })

  const { data: applications } =
    useQueryWrapper<Application[]>(`job-applications`)
  const { data: contacts } = useQueryWrapper<Contact[]>(`contacts`)
  const {
    data: touches,
    refetch: refetchTouches,
    isLoading: touchesAreLoading,
    isFetching: touchesAreFetching,
  } = useQueryWrapper<Touch[]>(`touches`)

  const { mutate: mutateUpdateTouch } = useMutation({
    mutationFn: ({ touch, id }: { touch: Partial<Touch>; id: number }) => {
      return axios.patch(
        `${getBaseUrl()}/touches/${id}`,
        JSON.stringify(touch),
        {
          headers: defaultHeaders,
        },
      )
    },
  })

  const createTouch = () => {
    mutateCreateTouch(formState)
  }

  const updateTouch = (updatedTouch: { touch: Partial<Touch>; id: number }) => {
    mutateUpdateTouch(updatedTouch)
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
  const touchTableData = () =>
    touches?.map((touch: Touch) => {
      const application =
        applications?.find((a: Application) => a.id === touch.jobApplicationId)
          ?.role || null
      return {
        ...touch,
        application,
      }
    })

  return (
    <Layout title='Touches'>
      <TableToolBar
        resource={touches}
        resourceName='Touch'
        resourceNamePlural='Touches'
        refetchResource={refetchTouches}
        setIsFormOpen={() => setIsTouchFormOpen(!isTouchFormOpen)}
      />
      <TouchesTable
        touchesAreLoading={touchesAreLoading || touchesAreFetching}
        updateTouch={updateTouch}
        tableData={touchTableData()}
        refreshTableData={refetchTouches}
      />
      <TouchForm
        scheduledDate={formState.scheduledDate}
        contactId={formState.contactId}
        isOpen={isTouchFormOpen}
        handleClose={() => setIsTouchFormOpen(false)}
        createTouch={createTouch}
        handleFormChange={handleFormChange}
        contacts={contacts}
      />
    </Layout>
  )
}
