import axios from "axios"
import { useMutation, useQuery } from '@tanstack/react-query'
import Button from '@mui/material/Button';
import {  useState } from "react";
import { InterviewsTable } from "../features/interview-table/InterviewTable";
import { Interview } from "../types/interview";
import Layout from "../components/layout/Layout";
import { InterviewForm } from "../features/interview-form/InterviewForm";
import { Company } from "../types/company";
import { Application } from "../types/application";
import { format } from "date-fns";
import { isValidDate } from "../utils/is-valid-date";

const DEV_API_URL = import.meta.env.VITE_DEV_API_URL

export const Interviews
 = () => {
  const [isInterviewFormOpen, setIsInterviewFormOpen] = useState(false)
  const [formState, setFormState] = useState<(Interview)>({
    round: null,
    notes: null,
    type: null,
    status: null,
    jobApplicationId: null,
    userId: 2,
    contactId: null,
    applications: [],
    jobApplication: undefined,
    date: null
  })

  const {mutate: mutateCreateInterview  } = useMutation({
    mutationFn: (interview: Interview) => {
      return axios.post(`${DEV_API_URL}/interviews`, JSON.stringify(interview),{
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    onSuccess: () => {
      setIsInterviewFormOpen(false)
      refetchInterviews()
    }
  })

  const { data: applications } = useQuery({
    queryKey: ['applications'],
    queryFn: () => fetch(`${DEV_API_URL}/job-applications`).then((res: any) => {
      return res.json()
    }),
  })

  const { data: interviews, refetch: refetchInterviews, isLoading: interviewsAreLoading, isFetching: interviewsAreFetching } = useQuery({
    queryKey: ['interviews'],
    queryFn: () => fetch(`${DEV_API_URL}/interviews`).then((res: any) => {
      return res.json()
    }),
  })

  const { data: companies } = useQuery({
    queryKey: ['companies'],
    queryFn: () => fetch(`${DEV_API_URL}/companies`).then((res: any) => {
      return res.json()
    }),
  })
  const {mutate: mutateUpdateInterview } = useMutation({
    mutationFn: ({interview, id} :{interview: Partial<Interview>, id: number}) => {
      return axios.patch(`${DEV_API_URL}/interviews/${id}`, JSON.stringify(interview),{
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
   
  })

  const createInterview = () => {
    mutateCreateInterview(formState)
  }

  const updateInterview = (updatedInterview: {interview: Partial<Interview>, id: number}) => {
    mutateUpdateInterview(updatedInterview)
  }

  const handleFormChange = (evt: any) => {
    setFormState((formState: any) => {
      const name = evt.target.name === 'applicationId' ? 'jobApplicationId' : evt.target.name
      const value = (isValidDate(evt.target.value)) ? format(new Date(evt.target.value), "yyyy-MM-dd") : evt.target.value
      return ({...formState, [name]: value})
    })
  }
  const interviewTableData = () => interviews?.map((interview: Interview) =>  {
    const application = applications?.find((a: Application) => a.id === interview.jobApplicationId)?.name || null
    return (
      {
        ...interview,
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
     <Layout title="Interviews">
        <div style={{display: 'flex', justifyContent: 'flex-start',alignItems: 'center', marginLeft: '1rem'}}>
          <Button
            color='info'
            variant="contained"
            onClick={()=> setIsInterviewFormOpen(!isInterviewFormOpen)}>
              Add interview
          </Button >
          <Button style={{marginLeft: '1rem'}} onClick={() => refetchInterviews()}>Refresh Data</Button>
          <div>Interviews: {`${interviews?.length || 0}`}</div>
        </div>
       {companyMap && <InterviewsTable
          interviewsAreLoading={interviewsAreLoading || interviewsAreFetching}
          companyMap={companyMap}
          updateInterview={updateInterview}
          tableData={interviewTableData()}
          refreshTableData={refetchInterviews}
          />}
        <InterviewForm
          companyMap={companyMap}
          applicationId={formState.applications[0]?.id}
          isOpen={isInterviewFormOpen}
          handleClose={()=>setIsInterviewFormOpen(false)} 
          createInterview={createInterview}
          handleFormChange={handleFormChange}
          applications={applications}
        />
    </Layout>
  )
}