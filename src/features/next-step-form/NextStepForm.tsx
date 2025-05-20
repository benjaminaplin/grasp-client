import Button from '@mui/material/Button'
import FormGroup from '@mui/material/FormGroup'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import { SelectInput } from '../../components/form/inputs/SelectInput'
import { Contact } from '../../types/contact'
import DatePicker from '../../components/form/inputs/DatePicker'
import { FormContainer } from '../../components/form/form-container/FormContainer'

type NextStepFormPropsType = {
  isOpen: boolean
  handleClose: (arg: boolean) => void
  handleFormChange: (evt: any) => void
  createNextStep: () => void
  contacts: Contact[] | undefined
  contactId?: number | null
  dueDate: any
}

export const NextStepForm = ({
  isOpen,
  handleClose,
  handleFormChange,
  createNextStep,
  contacts,
  contactId,
  dueDate,
}: NextStepFormPropsType) => {
  console.log('🚀 ~ isOpen:', isOpen)
  const contactOptions = [
    ...(contacts?.map((c: Contact) => ({
      value: c.id,
      label: `${c.firstName} ${c.lastName}`,
    })) || []),
  ]

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <FormContainer>
        <FormGroup onChange={handleFormChange}>
          <SelectInput
            label='Contact'
            name='contactId'
            handleChange={handleFormChange}
            value={contactId}
            options={contactOptions}
          />
          <TextField
            id='standard-basic'
            name='type'
            label='Type'
            variant='filled'
          />
          <DatePicker
            label='Due Date'
            value={dueDate}
            name='scheduledDate'
            onChange={handleFormChange}
          />
          <TextField
            id='standard-basic'
            name='notes'
            label='Notes'
            variant='filled'
          />
          <TextField
            id='standard-basic'
            name='action'
            label='Action'
            variant='filled'
          />
          <Button color='primary' variant='contained' onClick={createNextStep}>
            Create NextStep
          </Button>
        </FormGroup>
      </FormContainer>
    </Modal>
  )
}
