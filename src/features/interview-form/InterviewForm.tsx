import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import FormGroup from "@mui/material/FormGroup"
import Modal from "@mui/material/Modal"
import TextField from "@mui/material/TextField"
import {SelectInput } from "../../components/form/SelectInput"
import { Application } from "../../types/application"

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

type InterviewFormPropsType = {
  isOpen: boolean,
  handleClose: (arg: boolean)=>void,
  handleFormChange: (evt: any) => void,
  createInterview: () => void,
  applications: Application[] | undefined
  applicationId?: number | null
  companyMap: {[key: string]: string}
}

export const InterviewForm = ({
  isOpen,
  handleClose,
  handleFormChange,
  createInterview,
  applications,
  applicationId,
  companyMap
}: InterviewFormPropsType) => {
  const jobApplicationOptions = [
    ...(applications?.map((a: Application) => ({
      value: a.id,
      label: `${a.role} ${a.companyId ? companyMap?.[a.companyId] : 'unknown company'}`})) || []),
    { value: null, label: 'Please choose an application' }
  ]

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box  my={4} display="flex" alignItems="center" gap={4} p={2} sx={style}>
       <div style={{display: "flex", flexDirection: 'column', backgroundColor: "var(--davysgrey-lighter)", width: '100%', height: '100%'}}>
          <FormGroup onChange={handleFormChange}>
            <TextField id="standard-basic" name="round" label="Round" variant="filled" />
            <TextField id="standard-basic" name="status" label="Status" variant="filled" />
            <SelectInput name="applicationId" handleChange={handleFormChange} value={applicationId} options={jobApplicationOptions}/>
            <TextField id="standard-basic" name='date' label="Date" variant="filled" />
            <TextField id="standard-basic" name="notes" label="Notes" variant="filled" />
            <Button color='primary' variant="contained" onClick={createInterview}>Create Interview</Button >
          </FormGroup>
        </div>
      </Box>
    </Modal>
  )
}