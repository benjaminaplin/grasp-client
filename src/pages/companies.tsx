import axios from "axios"
import { useMutation, useQuery } from '@tanstack/react-query'
import Button from '@mui/material/Button';
import {  useState } from "react";
import { CompanyTable } from "../features/company-table/CompanyTable";
import { Company } from "../types/company";
import LeftDrawer from "../components/left-drawer/LeftDrawer";
import { CompanyForm } from "../features/company-form/CompanyForm";

const DEV_API_URL = import.meta.env.VITE_DEV_API_URL

export default function ButtonUsage() {
  return <Button variant="contained">Hello world</Button>;
}

export const Companies
 = () => {
  const [isCompanyFormOpen, setIsCompanyFormOpen] = useState(false)
  const [formState, setFormState] = useState<(Company)>({
    name: null,
    type: null,
    notes: null,
    userId: 2,
    jobApplications: []
  })

  const {mutate: mutateCreateCompany } = useMutation({
    mutationFn: (company: Company) => {
      return axios.post(`${DEV_API_URL}/companies`, JSON.stringify(company),{
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    onSuccess: () => {
      setIsCompanyFormOpen(false)
      refetchCompanies()
    }
  })

  const { data, refetch: refetchCompanies } = useQuery({
    queryKey: ['companies'],
    queryFn: () => fetch(`${DEV_API_URL}/companies`).then((res: any) => {
      return res.json()
    }),
  })

  const {mutate: mutateUpdateCompany } = useMutation({
    mutationFn: ({company, id} :{company: Partial<Company>, id: number}) => {
      return axios.patch(`${DEV_API_URL}/companies/${id}`, JSON.stringify(company),{
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
   
  })

  const createCompany = () => {
    mutateCreateCompany(formState)
  }

  const updateCompany = (updatedCompany: {company: Partial<Company>, id: number}) => {
    mutateUpdateCompany(updatedCompany)
  }

  const handleFormChange = (evt: any) => {
    setFormState((formState: any) => ({...formState, [evt.target.name]: evt.target.value}))
  }

  return (
     <LeftDrawer title="Companies" >
      <div style={{padding: '2rem 0'}}>
        <Button
          color='info'
          variant="contained"
          onClick={()=> setIsCompanyFormOpen(!isCompanyFormOpen)}>
            Add Company
        </Button >
        <Button style={{marginLeft: '1rem'}} onClick={() => refetchCompanies()}>Refresh Data</Button>
        <CompanyTable
          updateCompany={updateCompany}
          tableData={data}
          refreshTableData={refetchCompanies}/>
        <CompanyForm
          isOpen={isCompanyFormOpen}
          handleClose={()=>setIsCompanyFormOpen(false)} 
          createCompany={createCompany}
          handleFormChange={handleFormChange}
        />
      </div>
    </LeftDrawer>
  )
}