import axios from "axios"
import { useMutation, useQuery } from '@tanstack/react-query'
import Button from '@mui/material/Button';
import {  useState } from "react";
import { ContactsTable } from "../features/contact-table/ContactTable";
import { Contact } from "../types/contact";
import { ContactForm } from "../features/contact-form/ContactForm";
import Layout from "../components/layout/Layout";

const DEV_API_URL = import.meta.env.VITE_DEV_API_URL

export default function ButtonUsage() {
  return <Button variant="contained">Hello world</Button>;
}

export const Contacts
 = () => {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [contactToEditId, setContactToEditId] = useState<number | undefined>()
  const [formState, setFormState] = useState<Contact>({
    title: null,
    type: null,
    notes: null,
    firstName: null,
    lastName: null,
    userId: 2,
    closeness: null,
    nextSteps: [],
    companyId: null
  })

  const onMutateSuccess = () => {
    setIsContactFormOpen(false)
    refetchContacts()
  }

  const {mutate: mutateCreateContact } = useMutation({
    mutationFn: (contact: Contact) => {
      return axios.post(`${DEV_API_URL}/contacts`, JSON.stringify(contact),{
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    onSuccess: onMutateSuccess
  })

  const {mutate: mutateDeleteContact } = useMutation({
    mutationFn: (contactId: number) => {
      return axios.delete(`${DEV_API_URL}/contacts/${contactId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    onSuccess: onMutateSuccess
  })

  const { data, refetch: refetchContacts, isLoading: contactsAreLoading, isFetching: contactsAreFetching } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => fetch(`${DEV_API_URL}/contacts`).then((res: any) => {
      return res.json()
    }),
  })
  const { data: companies, refetch: refetchCompanies, isLoading: companiesAreLoading, isFetching: companiesAreFetching } = useQuery({
    queryKey: ['companies'],
    queryFn: () => fetch(`${DEV_API_URL}/companies`).then((res: any) => {
      return res.json()
    }),
  })
  const { data: contact, refetch: refetchContact, isLoading: contactIsLoading, isFetching: contactIsFetching } = useQuery({
    queryKey: ['contact'],
    queryFn: () => fetch(`${DEV_API_URL}/contacts/${contactToEditId}`).then((res: any) => {
      return res.json()
    }),
    enabled: !!contactToEditId
  })
  
  const {mutate: mutateUpdateContact } = useMutation({
    mutationFn: ({contact, id} :{contact: Partial<Contact>, id: number}) => {
      return axios.patch(`${DEV_API_URL}/contacts/${id}`, JSON.stringify(contact),{
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
   
  })

  const deleteContact = (contactId: number) => {
    mutateDeleteContact(contactId)
  }

  const createContact = () => {
    mutateCreateContact(formState)
  }

  const updateContact = (updatedContact: {contact: Partial<Contact>, id: number}) => {
    mutateUpdateContact(updatedContact)
  }

  const handleFormChange = (evt: any) => {
    setFormState((formState: any) => ({...formState, [evt.target.name]: evt.target.value}))
  }

  const openContactForm = (contactId: number | undefined) => {
    setContactToEditId(contactId)
    setIsContactFormOpen(true)
  }
  return (
     <Layout title="Contacts" >
        <Button
          color='info'
          variant="contained"
          onClick={()=> setIsContactFormOpen(!isContactFormOpen)}>
            Add Contact
        </Button >
        <Button style={{marginLeft: '1rem'}} onClick={() => refetchContacts()}>Refresh Data</Button>
        <ContactsTable
          contactsAreLoading={contactsAreLoading || contactsAreFetching}
          updateContact={updateContact}
          tableData={data}
          refreshTableData={refetchContacts}
          deleteContact={deleteContact}
          handleOpenContactForm={openContactForm} 
        />
        <ContactForm
          companies={companies}
          companyId={formState.companyId}
          contact={contact}
          isOpen={isContactFormOpen}
          handleClose={()=>setIsContactFormOpen(false)} 
          createContact={createContact}
          handleFormChange={handleFormChange}
        />
    </Layout>
  )
}