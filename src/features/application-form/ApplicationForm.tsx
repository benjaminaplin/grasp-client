import Button from '@mui/material/Button'
import FormGroup from '@mui/material/FormGroup'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import { SelectInput } from '../../components/form/inputs/SelectInput'
import { Company } from '../../types/company'
import { FormContainer } from '../../components/form/form-container/FormContainer'

type ApplicationFormPropsType = {
  isOpen: boolean
  handleClose: (arg: boolean) => void
  handleFormChange: (evt: any) => void
  createApplication: () => void
  companies: Company[] | undefined
  companyId?: number | null
}

export const ApplicationForm = ({
  isOpen,
  handleClose,
  handleFormChange,
  createApplication,
  companies,
  companyId,
}: ApplicationFormPropsType) => {
  const companyOptions = [
    ...(companies?.map((c: Company) => ({ value: c.id, label: c.name })) || []),
    { value: null, label: 'Please choose a company' },
  ]

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <FormContainer>
        <FormGroup onChange={handleFormChange}>
          <TextField
            id='standard-basic'
            name='role'
            label='Role'
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
            name='type'
            label='Type'
            variant='filled'
          />
          <TextField
            id='standard-basic'
            name='status'
            label='Status'
            variant='filled'
          />
          <TextField
            id='standard-basic'
            name='notes'
            label='Notes'
            variant='filled'
          />
          <Button
            color='primary'
            variant='contained'
            onClick={createApplication}
          >
            Create Application
          </Button>
        </FormGroup>
      </FormContainer>
    </Modal>
  )
}
