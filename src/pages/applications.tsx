import axios from "axios"
import { useMutation, useQuery } from '@tanstack/react-query'
import Button from '@mui/material/Button';
import {  useState } from "react";
import { ApplicationsTable } from "../features/application-table/ApplicationTable";
import { Application } from "../types/application";
// import { ApplicationForm } from "../features/application-form/application-form";
import LeftDrawer from "../features/left-drawer/LeftDrawer";
import { ApplicationForm } from "../features/application-form/ApplicationForm";

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
    userId: 2
  })

  const {mutate: mutateCreateapplication  } = useMutation({
    mutationFn: (application: Application) => {
      console.log('application', application)
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

  const { data: companies, refetch: refetchCompanies } = useQuery({
    queryKey: ['applications'],
    queryFn: () => fetch(`${DEV_API_URL}/companies`).then((res: any) => {
      return res.json()
    }),
  })

  const { data, refetch: refetchApplications } = useQuery({
    queryKey: ['applications'],
    queryFn: () => fetch(`${DEV_API_URL}/job-applications`).then((res: any) => {
      return res.json()
    }),
  })

  const {mutate: mutateUpdateapplication } = useMutation({
    mutationFn: ({application, id} :{application: Partial<Application>, id: number}) => {
      console.log('application', application)
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
    mutateUpdateapplication(updatedapplication)
  }

  const handleFormChange = (evt: any) => {
    setFormState((formState: any) => ({...formState, [evt.target.name]: evt.target.value}))
  }

  return (
     <LeftDrawer >
      <div style={{padding: '2rem 0'}}>
        <Button
          color='info'
          variant="contained"
          onClick={()=> setIsapplicationFormOpen(!isapplicationFormOpen)}>
            Add application
        </Button >
        <Button style={{marginLeft: '1rem'}} onClick={() => refetchapplications()}>Refresh Data</Button>
        <ApplicationsTable
          updateApplication={updateApplication}
          tableData={data}
          refreshTableData={refetchApplications}
          />
        <ApplicationForm
          isOpen={isapplicationFormOpen}
          handleClose={()=>setIsapplicationFormOpen(false)} 
          createApplication={createApplication}
          handleFormChange={handleFormChange}
          companies={companies}
        />
      </div>
    </LeftDrawer>
  )
}