import axios from "axios"
import { useMutation, useQuery } from '@tanstack/react-query'
import Button from '@mui/material/Button';
import {  useState } from "react";
import { CompanyTable } from "../features/company-table/CompanyTable";
import { Company } from "../types/company";
import Layout from "../components/layout/Layout";
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
    jobApplications: [],
    users: []
  })

  const onMutateSuccess = () => {
    setIsCompanyFormOpen(false)
    refetchCompanies()
  }

  const {mutate: mutateCreateCompany } = useMutation({
    mutationFn: (company: Company) => {
      return axios.post(`${DEV_API_URL}/companies`, JSON.stringify(company),{
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    onSuccess: onMutateSuccess
  })

  const { data, refetch: refetchCompanies } = useQuery({
    queryKey: ['companies'],
    queryFn: () => fetch(`${DEV_API_URL}/users/2/companies`).then((res: any) => {
      return res.json()
    }),
  })

  const {mutate: mutateDeleteCompany } = useMutation({
    mutationFn: (companyId: number) => {
      return axios.delete(`${DEV_API_URL}/companies/${companyId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    onSuccess: onMutateSuccess
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

  const deleteCompany = (companyId: number) => {
    mutateDeleteCompany(companyId)
  }
  return (
     <Layout title="Companies" >
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
          refreshTableData={refetchCompanies}
          deleteCompany={deleteCompany}
          />
        <CompanyForm
          isOpen={isCompanyFormOpen}
          handleClose={()=>setIsCompanyFormOpen(false)} 
          createCompany={createCompany}
          handleFormChange={handleFormChange}
        />
    </Layout>
  )
}