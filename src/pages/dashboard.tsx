import Typography from '@mui/material/Typography'
import { DashboardCard } from '../components/dashboard-card/DashboardCard'
import Layout from '../components/layout/Layout'
import { useQueryWrapper } from '../context/WrapUseQuery'
import '../styles/dashboard.css'
import { Application } from '../types/application'
import { Company } from '../types/company'
import { Contact } from '../types/contact'
import { Interview } from '../types/interview'
import { NextStep } from '../types/next-step'
import { PaginatedResponse } from '../types/paginatedResponse'

export const Dashboard = () => {
  const { data: companies } = useQueryWrapper<Company[]>(`users/2/companies`)
  const { data: applications } =
    useQueryWrapper<PaginatedResponse<Application>>(`job-applications`)
  console.log('🚀 ~ Dashboard ~ applications:', applications)
  const { data: nextSteps } = useQueryWrapper<NextStep[]>(`next-steps`)
  const { data: interviews } = useQueryWrapper<Interview[]>(`interviews`)
  const { data: touches } = useQueryWrapper<Contact[]>(`touches`)

  const recruiterApplications =
    applications?.data?.filter((application: Application) =>
      application.type?.includes('recruiter'),
    )?.length || 0
  const coldApplications =
    applications?.data?.filter((application: Application) =>
      application.type?.includes('cold'),
    )?.length || 0
  const connectionApplications =
    applications?.data?.filter((application: Application) =>
      application.type?.includes('connection'),
    )?.length || 0

  return (
    <Layout title='Dashboard'>
      <div className='stat-cards-container'>
        <DashboardCard
          title='Applications'
          color='coral'
          destinationOnClick='/job-applications'
          content={<StatContainer>{applications?.total || 0}</StatContainer>}
        />
        <DashboardCard
          title='Recruiter Applications'
          color='green-blue-light'
          destinationOnClick='/job-applications'
          content={<StatContainer>{recruiterApplications}</StatContainer>}
        />
        <DashboardCard
          title='Cold Applications'
          color='green-blue-light'
          destinationOnClick='/job-applications'
          content={<StatContainer>{coldApplications}</StatContainer>}
        />
        <DashboardCard
          title='Connection Applications'
          color='green-blue-light'
          destinationOnClick='/job-applications'
          content={<StatContainer>{connectionApplications}</StatContainer>}
        />
        <DashboardCard
          title='Companies'
          color='verdigris'
          destinationOnClick='/companies'
          content={<StatContainer>{companies?.length || 0}</StatContainer>}
        />
        <DashboardCard
          title='Next Steps'
          color='verdigris'
          destinationOnClick='/next-steps'
          content={<StatContainer>{nextSteps?.length || 0}</StatContainer>}
        />
        <DashboardCard
          title='Interviews'
          color='verdigris'
          destinationOnClick='/interviews'
          content={<StatContainer>{interviews?.length || 0}</StatContainer>}
        />
        <DashboardCard
          title='Touches'
          color='verdigris'
          destinationOnClick='/touches'
          content={<StatContainer>{touches?.length || 0}</StatContainer>}
        />
      </div>
    </Layout>
  )
}

const StatContainer = ({ children }: { children: number }) => {
  return (
    <Typography align='center' variant='h4'>
      {children}
    </Typography>
  )
}
