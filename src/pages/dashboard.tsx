import { DashboardCard } from '../components/dashboard-card/DashboardCard'
import Layout from '../components/layout/Layout'
import Typography from '@mui/material/Typography'
import '../styles/dashboard.css'
import { Contact } from '../types/contact'
import { Application } from '../types/application'
import { useQueryWrapper } from '../context/WrapUseQuery'
import { Company } from '../types/company'
import { NextStep } from '../types/next-step'
import { Interview } from '../types/interview'

export const Dashboard = () => {
  const { data: companies } = useQueryWrapper<Company[]>(`users/3/companies`)
  const { data: applications } =
    useQueryWrapper<Application[]>(`job-applications`)
  const { data: nextSteps } = useQueryWrapper<NextStep[]>(`next-steps`)
  const { data: contacts } = useQueryWrapper<Contact[]>(`contacts`)
  const { data: interviews } = useQueryWrapper<Interview[]>(`interviews`)
  const { data: touches } = useQueryWrapper<Contact[]>(`touches`)

  const recruiters =
    contacts?.filter((contact: Contact) => contact.type === 'Recruiter')
      ?.length || 0
  const recruiterApplications =
    applications?.filter((application: Application) =>
      application.type?.includes('recruiter'),
    )?.length || 0
  const coldApplications =
    applications?.filter((application: Application) =>
      application.type?.includes('cold'),
    )?.length || 0
  const connectionApplications =
    applications?.filter((application: Application) =>
      application.type?.includes('connection'),
    )?.length || 0

  return (
    <Layout title='Dashboard'>
      <div className='stat-cards-container'>
        <DashboardCard
          title='Applications'
          color='coral'
          destinationOnClick='/job-applications'
          content={<StatContainer>{applications?.length || 0}</StatContainer>}
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
          title='Contacts'
          color='verdigris'
          destinationOnClick='/contacts'
          content={<StatContainer>{contacts?.length || 0}</StatContainer>}
        />
        <DashboardCard
          title='Recruiters'
          color='verdigris'
          destinationOnClick='/contacts'
          content={<StatContainer>{recruiters}</StatContainer>}
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
          color='picton-blue'
          destinationOnClick='/interviews'
          content={<StatContainer>{interviews?.length || 0}</StatContainer>}
        />
        <DashboardCard
          title='Touches'
          color='picton-blue'
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
