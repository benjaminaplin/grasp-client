import axios from "axios"
import { useMutation } from '@tanstack/react-query'
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import TextField from "@mui/material/TextField";
import {  useState } from "react";
import { ContactsTable } from "../features/contact-table/contacts-table";

const DEV_API_URL = import.meta.env.VITE_DEV_API_URL


export default function ButtonUsage() {
  return <Button variant="contained">Hello world</Button>;
}
export const HomePage = () => {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [formState, setFormState] = useState({
    title: null,
    type: null,
    notes: null,
    firstName: null,
    lastName: null,
    userId: 2
  })

  console.log('DEV_API_URL', DEV_API_URL)


  const mutation = useMutation({
    mutationFn: (contact: any) => {
      console.log('contact', contact)
      return axios.post(`${DEV_API_URL}/contacts`, JSON.stringify(contact),{
        headers: {
          // Overwrite Axios's automatically set Content-Type
          'Content-Type': 'application/json'
        }
      })
    },
  })

  const createContact = () => {
    mutation.mutate(formState)
  }

  const handleFormChange = (evt: any) => {
    setFormState((formState: any) => ({...formState, [evt.target.name]: evt.target.value}))
  }
  return (
    <div style={{display: 'flex', width: '60vw', justifyContent: 'space-between' }}>
      <div>
        <Button color='info' variant="contained" onClick={()=> setIsContactFormOpen(!isContactFormOpen)}>Open Contact Form</Button >
        {isContactFormOpen
        ? <div style={{display: "flex", flexDirection: 'column'}}>
          <FormGroup onChange={handleFormChange}>
            <TextField id="standard-basic" name="title" label="Title" variant="filled" />
            <TextField id="standard-basic" name='type' label="Type" variant="filled" />
            <TextField id="standard-basic" name="notes" label="Notes" variant="filled" />
            <TextField id="standard-basic" name="firstName" label="First Name" variant="filled" />
            <TextField id="standard-basic" name="lastName" label="Last Name" variant="filled" />
            <Button color='primary' variant="contained" onClick={createContact}>Create Contact</Button >
          </FormGroup>
          </div>
        : null}
      </div>
      <ContactsTable />
    </div>
  )
}