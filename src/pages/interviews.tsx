import axios from "axios"
import { useMutation } from '@tanstack/react-query'
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
import { defaultHeaders, useQueryWrapper } from "../context/WrapUseQuery";
import { groupBy, orderBy } from "lodash";

const DEV_API_URL = import.meta.env.VITE_DEV_API_URL
type CompanyMap = {[key: string]: Company[]}

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
        headers: defaultHeaders
      })
    },
    onSuccess: () => {
      setIsInterviewFormOpen(false)
      refetchInterviews()
    }
  })

  const { data: applications  } = useQueryWrapper<Application[]>(`job-applications`)

  const {  data: interviews,
    refetch: refetchInterviews,
    isLoading: interviewsAreLoading,
    isFetching: interviewsAreFetching } = useQueryWrapper<Interview[]>(`interviews`)
  
  const { data: companyMap } = useQueryWrapper<Company[]>(
    'companies',
    undefined,
    { select: (fetchedData: Company[]) =>  groupBy(orderBy(fetchedData, ['name']), (company: Company) => company.id)
  })

  const {mutate: mutateUpdateInterview } = useMutation({
    mutationFn: ({interview, id} :{interview: Partial<Interview>, id: number}) => {
      return axios.patch(`${DEV_API_URL}/interviews/${id}`, JSON.stringify(interview),{
        headers: defaultHeaders
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
      const value = ( evt.target.name === 'date' && isValidDate(evt.target.value)) ? format(new Date(evt.target.value), "yyyy-MM-dd") : evt.target.value
      return ({...formState, [name]: value})
    })
  }
  
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
          companyMap={companyMap as unknown as CompanyMap}
          updateInterview={updateInterview}
          tableData={interviews}
          refreshTableData={refetchInterviews}
          />}
        <InterviewForm
        companyMap={companyMap as unknown as CompanyMap}
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