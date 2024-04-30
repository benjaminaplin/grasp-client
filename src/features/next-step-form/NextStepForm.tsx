import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import FormGroup from "@mui/material/FormGroup"
import Modal from "@mui/material/Modal"
import TextField from "@mui/material/TextField"
import {SelectInput } from "../../components/form/SelectInput"
import { Contact } from "../../types/contact"
import DatePicker from "../../components/form/DatePicker"

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

type NextStepFormPropsType = {
  isOpen: boolean,
  handleClose: (arg: boolean)=>void,
  handleFormChange: (evt: any) => void,
  createNextStep: () => void,
  contacts: Contact[] | undefined
  contactId?: number | null,
  dueDate: any
}

export const NextStepForm = ({
  isOpen,
  handleClose,
  handleFormChange,
  createNextStep,
  contacts, contactId,dueDate
}: NextStepFormPropsType) => {

  const contactOptions = [
    ...(contacts?.map((c: Contact) => ({value: c.id, label: `${c.firstName} ${c.lastName}`})) || [])
  ]

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box  my={4} display="flex" alignItems="center" gap={4} p={2} sx={style}>
       <div style={{display: "flex", flexDirection: 'column', backgroundColor: "var(--davysgrey-lighter)", width: '100%', height: '100%'}}>
          <FormGroup onChange={handleFormChange}>
            <SelectInput label='Contact'  name="contactId" handleChange={handleFormChange} value={contactId} options={contactOptions}/>
            <TextField id="standard-basic" name='type' label="Type" variant="filled" />
            <DatePicker label="Due Date" value={dueDate} name="scheduledDate" onChange={handleFormChange} />
            <TextField id="standard-basic" name="notes" label="Notes" variant="filled" />
            <TextField id="standard-basic" name="action" label="Action" variant="filled" />
            <Button color='primary' variant="contained" onClick={createNextStep}>Create NextStep</Button >
          </FormGroup>
        </div>
      </Box>
    </Modal>
  )
}