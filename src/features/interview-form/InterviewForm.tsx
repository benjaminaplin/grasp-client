import Button from '@mui/material/Button'
import FormGroup from '@mui/material/FormGroup'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import { SelectInput } from '../../components/form/inputs/SelectInput'
import { Application } from '../../types/application'
import { Company } from '../../types/company'
import { orderBy } from 'lodash'
import { FormContainer } from '../../components/form/form-container/FormContainer'
import DatePicker from '../../components/form/inputs/DatePicker'

type InterviewFormPropsType = {
  isOpen: boolean
  handleClose: (arg: boolean) => void
  handleFormChange: (evt: any) => void
  createInterview: () => void
  applications: Application[] | undefined
  applicationId?: number | null
  companyMap: { [key: string]: Company[] }
  interviewDate: any
}

export const InterviewForm = ({
  isOpen,
  handleClose,
  handleFormChange,
  createInterview,
  applications,
  applicationId,
  companyMap,
  interviewDate,
}: InterviewFormPropsType) => {
  const jobApplicationOptions = orderBy(
    [
      ...(applications?.map((a: Application) => ({
        value: a.id,
        label: `${a.companyId ? companyMap?.[a.companyId]?.[0]?.name : 'unknown company'} ${a.role}`,
      })) || []),
    ],
    ['label'],
  )

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <FormContainer>
        <FormGroup onChange={handleFormChange}>
          <TextField
            id='standard-basic'
            name='round'
            label='Round'
            variant='filled'
          />
          <TextField
            id='standard-basic'
            name='status'
            label='Status'
            variant='filled'
          />
          <SelectInput
            label='Application'
            name='applicationId'
            handleChange={handleFormChange}
            value={applicationId}
            options={jobApplicationOptions}
          />
          <DatePicker
            label='Date'
            value={interviewDate}
            name='scheduledDate'
            onChange={handleFormChange}
          />
          <TextField
            id='standard-basic'
            name='notes'
            label='Notes'
            variant='filled'
          />
          <Button color='primary' variant='contained' onClick={createInterview}>
            Create Interview
          </Button>
        </FormGroup>
      </FormContainer>
    </Modal>
  )
}
