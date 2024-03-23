import { useQuery } from "@tanstack/react-query"
import { DashboardCard } from "../components/dashboard-card/DashboardCard"
import Layout from "../components/layout/Layout"
import Typography from "@mui/material/Typography"
import '../styles/dashboard.css'
import { Contact } from "../types/contact"
import { Application } from "../types/application"

const DEV_API_URL = import.meta.env.VITE_DEV_API_URL

export const Dashboard = () => {

  const { data: companies } = useQuery({
    queryKey: ['companies'],
    queryFn: () => fetch(`${DEV_API_URL}/companies`).then((res: any) => 
      res.json()
    ),
  })

  const { data: applications  } = useQuery({
    queryKey: ['applications'],
    queryFn: () => fetch(`${DEV_API_URL}/job-applications`).then((res: any) => 
      res.json()
    ),
  })

  const { data: nextSteps  } = useQuery({
    queryKey: ['nextSteps'],
    queryFn: () => fetch(`${DEV_API_URL}/next-steps`).then((res: any) => 
       res.json()
    ),
  })

  const { data: contacts } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => fetch(`${DEV_API_URL}/contacts`).then((res: any) => 
      res.json()
    ),
  })

  const recruiters = contacts?.filter((contact: Contact) => contact.type === 'Recruiter')?.length
  const recruiterApplications = applications?.filter((application: Application) => application.type?.includes('recruiter'))?.length
  const coldApplications = applications?.filter((application: Application) => application.type?.includes('cold'))?.length
  const connectionApplications = applications?.filter((application: Application) => application.type?.includes('connection'))?.length

  return (
    <Layout title="Next Steps" >
      <div className='stat-cards-container'>
        <DashboardCard title='Applications' content={<StatContainer>{applications?.length}</StatContainer> || 0}/>
        <DashboardCard title='Recruiter Applications' content={<StatContainer>{recruiterApplications}</StatContainer> || 0}/>
        <DashboardCard title='Cold Applications' content={<StatContainer>{coldApplications}</StatContainer> || 0}/>
        <DashboardCard title='Connection Applications' content={<StatContainer>{connectionApplications}</StatContainer> || 0}/>
        <DashboardCard title='Contacts' content={<StatContainer>{contacts?.length}</StatContainer> || 0} />
        <DashboardCard title='Companies' content={<StatContainer>{companies?.length}</StatContainer> || 0}/>
        <DashboardCard title='Next Steps' content={<StatContainer>{nextSteps?.length}</StatContainer> || 0} />
        <DashboardCard title='Contacts' content={<StatContainer>{contacts?.length}</StatContainer> || 0} />
        <DashboardCard title='Recruiters' content={<StatContainer>{recruiters}</StatContainer> || 0} />
      </div>
    </Layout>
  )
}

const StatContainer = ({ children }: { children: number }) => {
  return <Typography align='center' variant='h4'>{children}</Typography>
}