import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import FormGroup from "@mui/material/FormGroup"
import Modal from "@mui/material/Modal"
import TextField from "@mui/material/TextField"

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

type ContactFormPropsType = { isOpen: boolean, handleClose: (arg: boolean)=>void, handleFormChange: (evt: any) => void,  createContact: () => void}

export const ContactForm = ({ isOpen, handleClose, handleFormChange, createContact}: ContactFormPropsType) => {
  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
    >
      <Box my={4} display="flex" alignItems="center" gap={4} p={2} sx={style}
      >
       <div style={{display: "flex", flexDirection: 'column', backgroundColor: "var(--davysgrey-lighter)", width: '100%', height: '100%'}}>
          <FormGroup onChange={handleFormChange}>
            <TextField id="standard-basic" name="title" label="Title" variant="filled" />
            <TextField id="standard-basic" name='type' label="Type" variant="filled" />
            <TextField id="standard-basic" name="notes" label="Notes" variant="filled" />
            <TextField id="standard-basic" name="firstName" label="First Name" variant="filled" />
            <TextField id="standard-basic" name="lastName" label="Last Name" variant="filled" />
            <TextField id="standard-basic" name="closeness" label="Closeness" variant="filled" />
            <Button color='primary' variant="contained" onClick={createContact}>Create Contact</Button >
          </FormGroup>
          </div>
      </Box>
    </Modal>
  )
}