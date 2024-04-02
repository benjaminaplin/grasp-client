import axios from "axios"
import { useMutation, useQuery } from '@tanstack/react-query'
import Button from '@mui/material/Button';
import {  useState } from "react";
import { ApplicationsTable } from "../features/application-table/ApplicationTable";
import { Application } from "../types/application";
import Layout from "../components/layout/Layout";
import { ApplicationForm } from "../features/application-form/ApplicationForm";
import { Company } from "../types/company";

const DEV_API_URL = import.meta.env.VITE_DEV_API_URL

export default function ButtonUsage() {
  return <Button variant="contained">Hello world</Button>;
}

export const Applications
 = () => {
  const [isapplicationFormOpen, setIsapplicationFormOpen] = useState(false)
  const [formState, setFormState] = useState<(Application)>({
    type: null,
    notes: null,
    role: null,
    userId: 2,
    companies: [],
    companyId: null,
    dateApplied: null
  })

  const {mutate: mutateCreateapplication  } = useMutation({
    mutationFn: (application: Application) => {
      return axios.post(`${DEV_API_URL}/job-applications`, JSON.stringify(application),{
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    onSuccess: () => {
      setIsapplicationFormOpen(false)
      refetchApplications()
    }
  })

  const { data: companies } = useQuery({
    queryKey: ['companies'],
    queryFn: () => fetch(`${DEV_API_URL}/companies`).then((res: any) => {
      return res.json()
    }),
  })

  const { data: applications, refetch: refetchApplications } = useQuery({
    queryKey: ['applications'],
    queryFn: () => fetch(`${DEV_API_URL}/job-applications`).then((res: any) => {
      return res.json()
    }),
  })

  const {mutate: mutateUpdateApplication } = useMutation({
    mutationFn: ({application, id} :{application: Partial<Application>, id: number}) => {
      return axios.patch(`${DEV_API_URL}/job-applications/${id}`, JSON.stringify(application),{
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
   
  })

  const createApplication = () => {
    mutateCreateapplication(formState)
  }

  const updateApplication = (updatedapplication: {application: Partial<Application>, id: number}) => {
    mutateUpdateApplication(updatedapplication)
  }

  const handleFormChange = (evt: any) => {
    setFormState((formState: any) => ({...formState, [evt.target.name]: evt.target.value}))
  }
  const applicationTableData = applications?.map((a: Application) =>  (
      {...a, company: companies?.find((c: Company) => c.id === a.companyId)?.name || null}
    ))
  

  return (
     <Layout title="Applications">
        <div style={{display: 'flex', justifyContent: 'flex-start',alignItems: 'center', marginLeft: '1rem'}}>
          <Button
            color='info'
            variant="contained"
            onClick={()=> setIsapplicationFormOpen(!isapplicationFormOpen)}>
              Add application
          </Button >
          <Button style={{marginLeft: '1rem'}} onClick={() => refetchApplications()}>Refresh Data</Button>
          <div>Applications: {`${applications?.length || 0}`}</div>
        </div>
        <ApplicationsTable
          updateApplication={updateApplication}
          tableData={applicationTableData}
          refreshTableData={refetchApplications}
          />
        <ApplicationForm
          companyId={formState.companies[0]?.id}
          isOpen={isapplicationFormOpen}
          handleClose={()=>setIsapplicationFormOpen(false)} 
          createApplication={createApplication}
          handleFormChange={handleFormChange}
          companies={companies}
        />
    </Layout>
  )
}