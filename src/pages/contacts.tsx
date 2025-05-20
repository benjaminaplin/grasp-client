import axios from 'axios'
import {
  keepPreviousData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { useState } from 'react'
import { ContactsTable } from '../features/contact-table/ContactTable'
import { Contact } from '../types/contact'
import { ContactForm } from '../features/contact-form/ContactForm'
import Layout from '../components/layout/Layout'
import { defaultHeaders, useQueryWrapper } from '../context/WrapUseQuery'
import { Company } from '../types/company'
import { orderBy } from 'lodash'
import { getBaseUrl } from '../service/getUrl'
import { TableToolBar } from '../components/table/table-tool-bar/TableToolBar'
import { usePagination } from '../hooks/usePagination'
import { PaginatedResponse } from '../types/paginatedResponse'
import { useAuth0 } from '@auth0/auth0-react'

export const Contacts = () => {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [contactToEditId, setContactToEditId] = useState<number | undefined>()
  const [formState, setFormState] = useState<Partial<Contact>>({
    title: null,
    type: null,
    notes: null,
    firstName: null,
    lastName: null,
    userId: 2,
    closeness: null,
    companyId: 0,
  })
  const queryClient = useQueryClient()
  const { getAccessTokenSilently } = useAuth0()
  const { pagination, setPagination } = usePagination()

  const onMutateSuccess = () => {
    setIsContactFormOpen(false)
    refetchContacts()
  }

  const { mutate: mutateCreateContact } = useMutation({
    mutationFn: async (contact: Contact) => {
      const token = await getAccessTokenSilently()
      console.log('🚀 ~ Contacts ~ token:', token)
      return axios.post(`${getBaseUrl()}/contacts`, JSON.stringify(contact), {
        headers: { ...defaultHeaders, Authorization: `Bearer ${token}` },
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
    data: contactTableData,
    refetch: refetchContacts,
    isLoading: contactsAreLoading,
    isFetching: contactsAreFetching,
  } = useQueryWrapper<PaginatedResponse<Contact>>(
    'contacts',
    undefined,
    { placeholderData: keepPreviousData }, // don't have 0 rows flash while changing pages/loading next page
    undefined,
    { page: pagination.pageIndex, limit: pagination.pageSize },
    undefined,
  )

  const { data: companies } = useQueryWrapper<Company[]>(
    'users/2/companies',
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
    console.log('🚀 ~ createContact ~ createContact:', createContact)

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
    console.log('🚀 ~ openContactForm ~ contactId:', contactId)
    setContactToEditId(contactId)
    setIsContactFormOpen(true)
  }
  console.log('🚀 ~ Contacts ~ contactTableData:', contactTableData)
  return (
    <Layout title='Contacts'>
      <TableToolBar
        resource={contactTableData?.data}
        resourceName='Contact'
        refetchResource={refetchContacts}
        setIsFormOpen={() => setIsContactFormOpen(!isContactFormOpen)}
      />
      {contactTableData?.data && (
        <ContactsTable
          contactsAreLoading={contactsAreLoading || contactsAreFetching}
          updateContact={updateContact}
          refreshTableData={refetchContacts}
          deleteContact={deleteContact}
          handleOpenContactForm={openContactForm}
          setPagination={setPagination}
          pagination={pagination}
          tableData={contactTableData}
          isLoading={contactsAreLoading}
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
