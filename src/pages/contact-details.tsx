import { useParams } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { useQueryWrapper } from '../context/WrapUseQuery'
import { Contact } from '../types/contact'
import { List, ListItem, Typography } from '@mui/material'
import { Touch } from '../types/touch'
import { Loader } from '../components/loaders/Loader'
import { format } from 'date-fns'
import Divider from '@mui/material/Divider'

export const ContactDetails = () => {
  const params = useParams()

  const {
    data: contact,
    isLoading: contactIsLoading,
    isFetching: contactIsFetching,
  } = useQueryWrapper<Contact>(`contacts/${params.id}`)
  const touches =
    contact?.touches?.sort(
      (a: Touch, b: Touch) =>
        // @ts-expect-error expect error because TS thinks `a` could be undefined
        new Date(b.scheduledDate) - new Date(a.scheduledDate),
    ) || []
  if (!contact) {
    return null
  }
  return (
    <Layout title='Contact'>
      {contactIsFetching || contactIsLoading ? (
        <Loader />
      ) : (
        <>
          <Typography variant='h4' color='text.primary'>
            {`${contact?.firstName} ${contact?.lastName}`}
          </Typography>
          <Typography variant='h6' gutterBottom>
            {`${contact?.title}`}
          </Typography>
          <Typography variant='h6' gutterBottom>
            {`${contact?.companies?.name || ' '}`}
          </Typography>
          <Typography variant='h6' gutterBottom>
            {`${contact?.closeness}`}
          </Typography>
          <Typography variant='h6' gutterBottom>
            {`${contact?.type !== contact.title ? contact.type : ''}`}
          </Typography>
          {
            <List disablePadding>
              {touches.map((touch) => (
                <ListItem
                  key={touch.id}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <Typography variant='h6' textAlign='left' fontWeight='medium'>
                    {touch.type}
                  </Typography>
                  <Typography
                    variant='body1'
                    textAlign='left'
                    fontWeight='medium'
                  >
                    {touch.scheduledDate
                      ? `${format(touch.scheduledDate, 'MM/dd/yyyy')}`
                      : null}
                  </Typography>
                  <Divider />
                  <Divider />
                  <Typography
                    variant='body1'
                    textAlign='left'
                    fontWeight='medium'
                  >
                    {touch.notes}
                  </Typography>
                </ListItem>
              ))}
            </List>
          }
        </>
      )}
    </Layout>
  )
}
