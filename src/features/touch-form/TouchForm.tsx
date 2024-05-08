import Button from '@mui/material/Button'
import FormGroup from '@mui/material/FormGroup'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import { SelectInput } from '../../components/form/inputs/SelectInput'
import { Contact } from '../../types/contact'
import DatePicker from '../../components/form/inputs/DatePicker'
import { FormContainer } from '../../components/form/form-container/FormContainer'

type TouchFormPropsType = {
  isOpen: boolean
  handleClose: (arg: boolean) => void
  handleFormChange: (evt: any) => void
  createTouch: () => void
  contacts: Contact[] | undefined
  contactId?: number | null
  scheduledDate: any
}

export const TouchForm = ({
  isOpen,
  handleClose,
  handleFormChange,
  createTouch,
  contacts,
  contactId,
  scheduledDate,
}: TouchFormPropsType) => {
  const contactOptions =
    contacts?.map((c: Contact) => ({
      value: c.id,
      label: `${c.firstName} ${c.lastName}`,
    })) || []

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <FormContainer>
        <FormGroup onChange={handleFormChange}>
          <TextField
            id='standard-basic'
            name='type'
            label='Type'
            variant='filled'
          />
          <SelectInput
            label='Contact'
            name='contactId'
            handleChange={handleFormChange}
            value={contactId}
            options={contactOptions}
          />
          <DatePicker
            label='Date'
            value={scheduledDate}
            name='scheduledDate'
            onChange={handleFormChange}
          />
          <TextField
            id='standard-basic'
            name='notes'
            label='Notes'
            variant='filled'
          />
          <Button color='primary' variant='contained' onClick={createTouch}>
            Create Touch
          </Button>
        </FormGroup>
      </FormContainer>
    </Modal>
  )
}
