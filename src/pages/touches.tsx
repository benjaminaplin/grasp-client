import axios from "axios"
import { useMutation, useQuery } from '@tanstack/react-query'
import Button from '@mui/material/Button';
import {  useState } from "react";
import { TouchesTable } from "../features/touch-table/TouchTable";
import { Touch } from "../types/touch";
import Layout from "../components/layout/Layout";
import { TouchForm } from "../features/touch-form/TouchForm";
import { Company } from "../types/company";
import { Application } from "../types/application";
import dayjs from "dayjs";

const DEV_API_URL = import.meta.env.VITE_DEV_API_URL

export const Touches
 = () => {
  const [isTouchFormOpen, setIsTouchFormOpen] = useState(false)
  const [formState, setFormState] = useState<(Partial<Touch>)>({
    notes: null,
    type: null,
    contactId: undefined,
    nextStep: null,
    jobApplicationId: undefined,
    userId: 2,
    scheduledDate: null
  })
  const {mutate: mutateCreateTouch  } = useMutation({
    mutationFn: (touch: Touch) => {
      return axios.post(`${DEV_API_URL}/touches`, JSON.stringify(touch),{
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    onSuccess: () => {
      setIsTouchFormOpen(false)
      refetchTouches()
    }
  })

  const { data: applications } = useQuery({
    queryKey: ['applications'],
    queryFn: () => fetch(`${DEV_API_URL}/job-applications`).then((res: any) => {
      return res.json()
    }),
  })

  const { data: touches, refetch: refetchTouches, isLoading: touchesAreLoading, isFetching: touchesAreFetching } = useQuery({
    queryKey: ['touches'],
    queryFn: () => fetch(`${DEV_API_URL}/touches`).then((res: any) => {
      return res.json()
    }),
  })
  const { data: companies } = useQuery({
    queryKey: ['companies'],
    queryFn: () => fetch(`${DEV_API_URL}/companies`).then((res: any) => {
      return res.json()
    }),
  })
  const { data: contacts } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => fetch(`${DEV_API_URL}/contacts`).then((res: any) => {
      return res.json()
    }),
  })

  const {mutate: mutateUpdateTouch } = useMutation({
    mutationFn: ({touch, id} :{touch: Partial<Touch>, id: number}) => {
      return axios.patch(`${DEV_API_URL}/touches/${id}`, JSON.stringify(touch),{
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
   
  })

  const createTouch = () => {
    mutateCreateTouch(formState)
  }

  const updateTouch = (updatedTouch: {touch: Partial<Touch>, id: number}) => {
    mutateUpdateTouch(updatedTouch)
  }

  const handleFormChange = (evt: any) => {
    const targetName = evt.target?.name
    setFormState((formState: any) => {
      const name = !targetName ? 'scheduledDate' : targetName === 'applicationId' ? 'jobApplicationId' : targetName
      const dateTimeValue = (!evt?.target && evt?.$d) ? dayjs(new Date(evt.$d)).format("YYYY-MM-DD") : evt.$d
      const value = !targetName ? dateTimeValue : evt?.target?.value
      return ({...formState, [name]: value})
    })
  }
  const touchTableData = () => touches?.map((touch: Touch) =>  {
    const application = applications?.find((a: Application) => a.id === touch.jobApplicationId)?.name || null
    return (
      {
        ...touch,
        application
      }
    )})
  
  const companyMap = companies?.reduce((acc: {[key: string]: string}, c: Company)=> {
    const companyId = c.id as unknown as string
    if(!acc[companyId]){
      // @ts-ignore
      acc[companyId] = c.name
    }
    return acc
  },{})

  return (
     <Layout title="Touches">
        <div style={{display: 'flex', justifyContent: 'flex-start',alignItems: 'center', marginLeft: '1rem'}}>
          <Button
            color='info'
            variant="contained"
            onClick={()=> setIsTouchFormOpen(!isTouchFormOpen)}>
              Add touch
          </Button >
          <Button style={{marginLeft: '1rem'}} onClick={() => refetchTouches()}>Refresh Data</Button>
          <div>Touches: {`${touches?.length || 0}`}</div>
        </div>
       {companyMap && <TouchesTable
          touchesAreLoading={touchesAreLoading || touchesAreFetching}
          companyMap={companyMap}
          updateTouch={updateTouch}
          tableData={touchTableData()}
          refreshTableData={refetchTouches}
          />}
        <TouchForm
          companyMap={companyMap}
          contactId={formState.contactId}
          isOpen={isTouchFormOpen}
          handleClose={()=>setIsTouchFormOpen(false)} 
          createTouch={createTouch}
          handleFormChange={handleFormChange}
          contacts={contacts}
      />
    </Layout>
  )
}