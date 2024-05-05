import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormGroup from '@mui/material/FormGroup'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import { Contact } from '../../types/contact'
import { SelectInput } from '../../components/form/SelectInput'
import { Company } from '../../types/company'

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

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
  const companyOptions = [
    ...(companies?.map((c: Company) => ({ value: c.id, label: c.name })) || []),
    { value: null, label: 'Please choose a company' },
  ]
  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box my={4} display='flex' alignItems='center' gap={4} p={2} sx={style}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--davysgrey-lighter)',
            width: '100%',
            height: '100%',
          }}
        >
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
        </div>
      </Box>
    </Modal>
  )
}
