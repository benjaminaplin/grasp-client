import axios from "axios"
import { useMutation, useQuery } from '@tanstack/react-query'
import Button from '@mui/material/Button';
import {  useState } from "react";
import { ContactsTable } from "../features/contact-table/contact-table";
import { Contact } from "../types/contact";
import { ContactForm } from "../features/contact-form/contact-form";
import LeftDrawer from "../features/left-drawer/LeftDrawer";

const DEV_API_URL = import.meta.env.VITE_DEV_API_URL

export default function ButtonUsage() {
  return <Button variant="contained">Hello world</Button>;
}

export const Contacts
 = () => {
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
          'Content-Type': 'application/json'
        }
      })
    },
    onSuccess: () => {
      setIsContactFormOpen(false)
      refetchContacts()
    }
  })

  const { data, refetch: refetchContacts } = useQuery({
    queryKey: ['test'],
    queryFn: () => fetch(`${DEV_API_URL}/contacts`).then((res: any) => {
      return res.json()
    }),
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
     <LeftDrawer >
      <div style={{padding: '2rem 0'}}>
        <Button
          color='info'
          variant="contained"
          onClick={()=> setIsContactFormOpen(!isContactFormOpen)}>
            Add Contact
        </Button >
        <Button style={{marginLeft: '1rem'}} onClick={() => refetchContacts()}>Refresh Data</Button>
        <ContactsTable
          updateContact={updateContact}
          tableData={data}
          refreshTableData={refetchContacts}/>
        <ContactForm
          isOpen={isContactFormOpen}
          handleClose={()=>setIsContactFormOpen(false)} 
          createContact={createContact}
          handleFormChange={handleFormChange}
        />
      </div>
    </LeftDrawer>
  )
}