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

type CompanyFormPropsType = {isOpen: boolean, handleClose: (arg: boolean)=>void, handleFormChange: (evt: any) => void,  createCompany: () => void}

export const CompanyForm = ({isOpen, handleClose, handleFormChange, createCompany}: CompanyFormPropsType) => {
  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
    >
      <Box my={4} display="flex" alignItems="center" gap={4} p={2} sx={style}>
       <div style={{display: "flex", flexDirection: 'column', backgroundColor: "var(--davysgrey-lighter)", width: '100%', height: '100%'}}>
          <FormGroup onChange={handleFormChange}>
            <TextField id="standard-basic" name="name" label="Name" variant="filled" />
            <TextField id="standard-basic" name="notes" label="Notes" variant="filled" />
            <Button color='primary' variant="contained" onClick={createCompany}>Create Company</Button >
          </FormGroup>
          </div>
      </Box>
    </Modal>
  )
}