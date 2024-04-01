import axios from "axios"
import { useMutation, useQuery } from '@tanstack/react-query'
import Button from '@mui/material/Button';
import {  useState } from "react";
import { NextStepTable } from "../features/next-step-table/NextStepTable";
import { NextStep } from "../types/next-step";
import Layout from "../components/layout/Layout";
import { NextStepForm } from "../features/next-step-form/NextStepForm";
import { Contact } from "../types/contact";

const DEV_API_URL = import.meta.env.VITE_DEV_API_URL

export default function ButtonUsage() {
  return <Button variant="contained">Hello world</Button>;
}

export const NextSteps
 = () => {
  const [isNextStepFormOpen, setIsNextStepFormOpen] = useState(false)
  const [formState, setFormState] = useState<(NextStep)>({
    type: null,
    notes: null,
    userId: 2,
    contactId: undefined,
    action: null,
    contacts: [],
    completed: false,
    completedDate: undefined
  })
  const { data: nextSteps, refetch: refetchNextSteps } = useQuery({
    queryKey: ['next-steps'],
    queryFn: () => fetch(`${DEV_API_URL}/next-steps`).then((res: any) => {
      return res.json()
    }),
  })

  const onMutateSuccess = () => {
    setIsNextStepFormOpen(false)
    refetchNextSteps()
  }

  const {mutate: mutateCreateNextStep  } = useMutation({
    mutationFn: (nextStep: NextStep) => {
      console.log('nextStep', nextStep)
      return axios.post(`${DEV_API_URL}/next-steps`, JSON.stringify(nextStep),{
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    onSuccess:onMutateSuccess
  })

  const { data: contacts } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => fetch(`${DEV_API_URL}/contacts`).then((res: any) => {
      return res.json()
    }),
  })


  const {mutate: mutateDeleteNextStep } = useMutation({
    mutationFn: (nextStepId: number) => {
      return axios.delete(`${DEV_API_URL}/next-steps/${nextStepId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    onSuccess: onMutateSuccess
  })

  const {mutate: mutateUpdateNextStep } = useMutation({
    mutationFn: ({nextStep, id} :{nextStep: Partial<NextStep>, id: number}) => {
      return axios.patch(`${DEV_API_URL}/next-steps/${id}`, JSON.stringify(nextStep),{
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
   
  })

  const createNextStep = () => {
    mutateCreateNextStep(formState)
  }

  const updateNextStep = (updatedNextStep: {nextStep: Partial<NextStep>, id: number}) => {
    mutateUpdateNextStep(updatedNextStep)
  }

  const handleFormChange = (evt: any) => {
    setFormState((formState: any) => ({...formState, [evt.target.name]: evt.target.value}))
  }

  const deleteNextStep = (nextStepId: number) => {
    mutateDeleteNextStep(nextStepId)
  }

  const nextStepTableData = nextSteps?.map((a: NextStep) =>  {
    const contact = contacts?.find((c: Contact) => c.id === a.contactId)
    return (
      {...a, contact: contact ? `${contact?.firstName} ${contact?.lastName}` : null}
    )})
  
  return (
     <Layout title="Next Steps" >
        <Button
          color='info'
          variant="contained"
          onClick={()=> setIsNextStepFormOpen(!isNextStepFormOpen)}>
            Add next step
        </Button >
        <Button style={{marginLeft: '1rem'}} onClick={() => refetchNextSteps()}>Refresh Data</Button>
        <NextStepTable
          updateNextStep={updateNextStep}
          tableData={nextStepTableData}
          refreshTableData={refetchNextSteps}
          deleteNextStep={deleteNextStep}
          />
        <NextStepForm
          contactId={formState.contacts?.[0]?.id}
          isOpen={isNextStepFormOpen}
          handleClose={()=>setIsNextStepFormOpen(false)} 
          createNextStep={createNextStep}
          handleFormChange={handleFormChange}
          contacts={contacts}
        />
    </Layout>
  )
}