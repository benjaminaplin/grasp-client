import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import Button from '@mui/material/Button'
import { useState } from 'react'
import { ContactsTable } from '../features/contact-table/ContactTable'
import { Contact } from '../types/contact'
import { ContactForm } from '../features/contact-form/ContactForm'
import Layout from '../components/layout/Layout'
import { defaultHeaders, useQueryWrapper } from '../context/WrapUseQuery'
import { Company } from '../types/company'
import { orderBy } from 'lodash'
import { getBaseUrl } from '../service/getUrl'

export const Contacts = () => {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [contactToEditId, setContactToEditId] = useState<number | undefined>()
  const [formState, setFormState] = useState<Partial<Contact>>({
    title: null,
    type: null,
    notes: null,
    firstName: null,
    lastName: null,
    userId: 3,
    closeness: null,
    companyId: 0,
  })

  const onMutateSuccess = () => {
    setIsContactFormOpen(false)
    refetchContacts()
  }

  const { mutate: mutateCreateContact } = useMutation({
    mutationFn: (contact: Contact) => {
      return axios.post(`${getBaseUrl()}/contacts`, JSON.stringify(contact), {
        headers: defaultHeaders,
      })
    },
    onSuccess: onMutateSuccess,
  })

  const { mutate: mutateDeleteContact } = useMutation({
    mutationFn: (contactId: number) => {
      return axios.delete(`${getBaseUrl()}/contacts/${contactId}`, {
        headers: defaultHeaders,
      })
    },
    onSuccess: onMutateSuccess,
  })

  const {
    data,
    refetch: refetchContacts,
    isLoading: contactsAreLoading,
    isFetching: contactsAreFetching,
  } = useQueryWrapper<Contact[]>('contacts')

  const { data: companies } = useQueryWrapper<Company[]>(
    'companies',
    undefined,
    { select: (fetchedData: Company[]) => orderBy(fetchedData, ['name']) },
  )
  const { data: contact } = useQueryWrapper(
    `contacts/${contactToEditId}`,
    undefined,
    {
      enabled: !!contactToEditId,
    },
  )

  const { mutate: mutateUpdateContact } = useMutation({
    mutationFn: ({
      contact,
      id,
    }: {
      contact: Partial<Contact>
      id: number
    }) => {
      return axios.patch(
        `${getBaseUrl()}/contacts/${id}`,
        JSON.stringify(contact),
        {
          headers: defaultHeaders,
        },
      )
    },
  })

  const deleteContact = (contactId: number) => {
    mutateDeleteContact(contactId)
  }

  const createContact = () => {
    mutateCreateContact(formState as Contact)
  }

  const updateContact = (updatedContact: {
    contact: Partial<Contact>
    id: number
  }) => {
    mutateUpdateContact(updatedContact)
  }

  const handleFormChange = (evt: any) => {
    setFormState((formState: any) => ({
      ...formState,
      [evt.target.name]: evt.target.value,
    }))
  }

  const openContactForm = (contactId: number | undefined) => {
    setContactToEditId(contactId)
    setIsContactFormOpen(true)
  }
  return (
    <Layout title='Contacts'>
      <Button
        color='info'
        variant='contained'
        onClick={() => setIsContactFormOpen(!isContactFormOpen)}
      >
        Add Contact
      </Button>
      <Button style={{ marginLeft: '1rem' }} onClick={() => refetchContacts()}>
        Refresh Data
      </Button>
      {data && (
        <ContactsTable
          contactsAreLoading={contactsAreLoading || contactsAreFetching}
          updateContact={updateContact}
          tableData={data}
          refreshTableData={refetchContacts}
          deleteContact={deleteContact}
          handleOpenContactForm={openContactForm}
        />
      )}
      {companies && (
        <ContactForm
          companies={companies}
          companyId={formState.companyId || 0}
          contact={contact as unknown as Contact | null}
          isOpen={isContactFormOpen}
          handleClose={() => setIsContactFormOpen(false)}
          createContact={createContact}
          handleFormChange={handleFormChange}
        />
      )}
    </Layout>
  )
}
