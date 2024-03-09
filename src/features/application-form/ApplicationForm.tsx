import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import FormGroup from "@mui/material/FormGroup"
import Modal from "@mui/material/Modal"
import TextField from "@mui/material/TextField"
import {SelectInput } from "../../components/form/SelectInput"
import { Company } from "../../types/company"
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

type ApplicationFormPropsType = {
  isOpen: boolean,
  handleClose: (arg: boolean)=>void,
  handleFormChange: (evt: any) => void,
  createApplication: () => void,
  companies: Company[] | undefined
}

export const ApplicationForm = ({
  isOpen,
  handleClose,
  handleFormChange,
  createApplication,
  companies
}: ApplicationFormPropsType) => {
  const companyOptions = companies?.map((c: Company) => ({value: c.name, label: c.name})) || []
  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
    >
      <Box
        my={4}
        display="flex"
        alignItems="center"
        gap={4}
        p={2}
        sx={style}
      >
       <div style={{display: "flex", flexDirection: 'column', backgroundColor: "lightgrey", width: '100%', height: '100%'}}>
          <FormGroup onChange={handleFormChange}>
            <TextField id="standard-basic" name="role" label="Role" variant="filled" />
            <SelectInput name="Company" handleChange={handleFormChange} value={null} options={companyOptions}/>
            <TextField id="standard-basic" name='type' label="Type" variant="filled" />
            <TextField id="standard-basic" name="notes" label="Notes" variant="filled" />
            <Button color='primary' variant="contained" onClick={createApplication}>Create Application</Button >
          </FormGroup>
          </div>
      </Box>
    </Modal>
  )
}