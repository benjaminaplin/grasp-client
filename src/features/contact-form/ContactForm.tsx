import Button from '@mui/material/Button'
import FormGroup from '@mui/material/FormGroup'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import { Contact } from '../../types/contact'
import { SelectInput } from '../../components/form/inputs/SelectInput'
import { Company } from '../../types/company'
import { FormContainer } from '../../components/form/form-container/FormContainer'
import { makeCompanyOptions } from '../../utils/make-company-options'

type ContactFormPropsType = {
  companies: Company[]
  companyId: number
  contact: Contact | null
  isOpen: boolean
  handleClose: (arg: boolean) => void
  handleFormChange: (evt: any) => void
  createContact: () => void
}

export const ContactForm = ({
  isOpen,
  handleClose,
  handleFormChange,
  createContact,
  companies,
  companyId,
}: ContactFormPropsType) => {
  const companyOptions = makeCompanyOptions(companies)
  return (
    <Modal open={isOpen} onClose={handleClose}>
      <FormContainer>
        <FormGroup onChange={handleFormChange}>
          <TextField
            id='standard-basic'
            name='title'
            label='Title'
            variant='filled'
          />
          <TextField
            id='standard-basic'
            name='type'
            label='Type'
            variant='filled'
          />
          <TextField
            id='standard-basic'
            name='notes'
            label='Notes'
            variant='filled'
          />
          <TextField
            id='standard-basic'
            name='firstName'
            label='First Name'
            variant='filled'
          />
          <TextField
            id='standard-basic'
            name='lastName'
            label='Last Name'
            variant='filled'
          />
          <SelectInput
            label='Company'
            name='companyId'
            handleChange={handleFormChange}
            value={companyId}
            options={companyOptions}
          />
          <TextField
            id='standard-basic'
            name='closeness'
            label='Closeness'
            variant='filled'
          />
          <Button color='primary' variant='contained' onClick={createContact}>
            Create Contact
          </Button>
        </FormGroup>
      </FormContainer>
    </Modal>
  )
}
