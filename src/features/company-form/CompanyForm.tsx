import Button from '@mui/material/Button'
import FormGroup from '@mui/material/FormGroup'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import { FormContainer } from '../../components/form/form-container/FormContainer'

type CompanyFormPropsType = {
  isOpen: boolean
  handleClose: (arg: boolean) => void
  handleFormChange: (evt: any) => void
  createCompany: () => void
}

export const CompanyForm = ({
  isOpen,
  handleClose,
  handleFormChange,
  createCompany,
}: CompanyFormPropsType) => {
  return (
    <Modal open={isOpen} onClose={handleClose}>
      <FormContainer>
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
              name='name'
              label='Name'
              variant='filled'
            />
            <TextField
              id='standard-basic'
              name='notes'
              label='Notes'
              variant='filled'
            />
            <Button color='primary' variant='contained' onClick={createCompany}>
              Create Company
            </Button>
          </FormGroup>
        </div>
      </FormContainer>
    </Modal>
  )
}
