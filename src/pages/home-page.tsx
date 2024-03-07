import axios from "axios"
import { useMutation } from '@tanstack/react-query'
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import TextField from "@mui/material/TextField";
import {  useState } from "react";
import { ContactsTable } from "../features/contact-table/contacts-table";
import { Contact } from "../types/contact";

const DEV_API_URL = import.meta.env.VITE_DEV_API_URL


export default function ButtonUsage() {
  return <Button variant="contained">Hello world</Button>;
}
export const HomePage = () => {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [formState, setFormState] = useState<(Contact)>({
    title: null,
    type: null,
    notes: null,
    firstName: null,
    lastName: null,
    userId: 2
  })

  const {mutate: mutateCreateContact } = useMutation({
    mutationFn: (contact: Contact) => {
      console.log('contact', contact)
      return axios.post(`${DEV_API_URL}/contacts`, JSON.stringify(contact),{
        headers: {
          // Overwrite Axios's automatically set Content-Type
          'Content-Type': 'application/json'
        }
      })
    },
  })

  const {mutate: mutateUpdateContact } = useMutation({
    mutationFn: ({contact, id} :{contact: Partial<Contact>, id: number}) => {
      console.log('contact', contact)
      return axios.patch(`${DEV_API_URL}/contacts/${id}`, JSON.stringify(contact),{
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
  })


  const createContact = () => {
    mutateCreateContact(formState)
  }

  const updateContact = (updatedContact: {contact: Partial<Contact>, id: number}) => {
    mutateUpdateContact(updatedContact)
  }

  const handleFormChange = (evt: any) => {
    setFormState((formState: any) => ({...formState, [evt.target.name]: evt.target.value}))
  }
  return (
    <div style={{display: "flex"}} >
       <ContactsTable updateContact={updateContact}/>
      <div>
        <Button color='info' variant="contained" onClick={()=> setIsContactFormOpen(!isContactFormOpen)}>Add Contact</Button >
        {isContactFormOpen
        ? <div style={{display: "flex", flexDirection: 'column', backgroundColor: "lightgrey"}}>
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
     
    </div>
  )
}