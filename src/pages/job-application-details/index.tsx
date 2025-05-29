import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { defaultHeaders, useQueryWrapper } from '../../context/WrapUseQuery'
import { Application } from '../../types/application'
import Button from '@mui/material/Button'
import styles from './job-application-details.module.css'
import { NextStep } from '../../types/next-step'
import { NextStepForm } from '../../features/next-step-form/NextStepForm'
import { useMutation } from '@tanstack/react-query'
import { Contact } from '../../types/contact'
import { orderBy } from 'lodash'
import { getBaseUrl } from '../../service/getUrl'
import axios from 'axios'
import dayjs from 'dayjs'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Interview } from '../../types/interview'

export const JobApplicationDetails = () => {
  const params = useParams()
  const [isNextStepFormOpen, setIsNextStepFormOpen] = useState(false)
  const [formState, setFormState] = useState<NextStep>({
    type: null,
    notes: null,
    userId: 2,
    contactId: undefined,
    action: null,
    contacts: [],
    completed: false,
    dueDate: undefined,
  })

  const { data: contacts } = useQueryWrapper<Contact[]>(`contacts`, undefined, {
    select: (fetchedData: { data: NextStep[] }) =>
      orderBy(fetchedData.data, ['firstName']),
  })

  const { data: application, refetch: refetchApplication } =
    useQueryWrapper<Application>(`job-applications/${params?.applicationId}`)

  const onMutateSuccess = () => {
    setIsNextStepFormOpen(false)
    refetchApplication()
  }

  const { mutate: mutateCreateNextStep } = useMutation({
    mutationFn: (nextStep: NextStep) => {
      return axios.post(
        `${getBaseUrl()}/next-steps`,
        JSON.stringify(nextStep),
        {
          headers: defaultHeaders,
        },
      )
    },
    onSuccess: onMutateSuccess,
  })

  const handleFormChange = (evt: any) => {
    const targetName = evt.target?.name
    setFormState((formState: any) => {
      const name = !targetName ? 'dueDate' : targetName
      const dateTimeValue =
        !evt?.target && evt?.$d
          ? dayjs(new Date(evt.$d)).format('YYYY-MM-DD')
          : evt.$d
      const value = !targetName ? dateTimeValue : evt?.target?.value
      return { ...formState, [name]: value }
    })
  }

  const createNextStep = () => {
    mutateCreateNextStep(formState)
  }

  const handleOpenNextStepForm = () => {
    setIsNextStepFormOpen(!isNextStepFormOpen)
  }
  const interviews = application?.Interview || []

  return (
    <>
      {application ? (
        <div className={styles.container}>
          <h2 className={styles.title}>Job Application #{application.id}</h2>

          <p className={styles.field}>
            <span className={styles.label}>Company:</span>{' '}
            {application.company?.name || 'unknown'}
          </p>

          <p className={styles.field}>
            <span className={styles.label}>Role:</span> {application.role}
          </p>

          <p className={styles.field}>
            <span className={styles.label}>Type:</span> {application.type}
          </p>

          <p>
            <strong>Status:</strong> {application?.status || null}
          </p>
          <p>
            <strong>Date Applied:</strong> {application?.dateApplied}
          </p>
          <p>
            <strong>User ID:</strong> {application?.userId}
          </p>
          <p>
            <strong>Company ID:</strong> {application?.companyId}
          </p>
          <p>
            <strong>Link:</strong>{' '}
            {/* <a href={application?.link} target='_blank' rel='noopener noreferrer'>
          {application?.link}
        </a> */}
          </p>
          <p>
            <strong>Description:</strong> {application?.description}
          </p>
          <p>
            <strong>Notes:</strong> {application?.notes}
          </p>
          <div className={styles.nextStepContainer}>
            <h3>Next Steps</h3>
            <Button onClick={handleOpenNextStepForm}>Create Next Step</Button>
          </div>
          <div className={styles.nextSteps}>
            {application.nextsteps?.length === 0 ? (
              <p>No next steps</p>
            ) : (
              <ul>
                {application.nextsteps?.map((step: NextStep) => (
                  <li key={step.id} className={styles.nextStepItem}>
                    <strong>{step.description}</strong> —{' '}
                    {step.scheduledDate &&
                      new Date(step.scheduledDate).toLocaleDateString()}
                    {step.isCompleted && ' (Completed)'}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        'loading'
      )}
      <Interviews interviews={interviews} />
      <NextStepForm
        dueDate={formState.dueDate}
        contactId={formState.contacts?.[0]?.id}
        isOpen={isNextStepFormOpen}
        handleClose={() => setIsNextStepFormOpen(false)}
        createNextStep={createNextStep}
        handleFormChange={handleFormChange}
        contacts={contacts}
      />
    </>
  )
}

const Interviews = ({ interviews }: { interviews: Interview[] }) => {
  return (
    <>
      <h3>Interviews</h3>
      {interviews.map((interview: any) => (
        <Accordion key={interview.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              Round {interview.round} — {interview.type || 'Unknown Type'} —{' '}
              {new Date(interview.date).toLocaleDateString()}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <strong>Status:</strong> {interview.status}
            </Typography>
            <Typography>
              <strong>Notes:</strong> {interview.notes}
            </Typography>
            <Typography>
              <strong>User ID:</strong> {interview.userId}
            </Typography>
            <Typography>
              <strong>Contact ID:</strong> {interview.contactId ?? 'N/A'}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  )
}
