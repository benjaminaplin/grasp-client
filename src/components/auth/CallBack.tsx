import { useAuth0 } from '@auth0/auth0-react'
import Layout from '../layout/Layout'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export const CallbackPage = () => {
  const { error } = useAuth0()

  const navigate = useNavigate()

  useEffect(() => {
    if (!error) {
      navigate('/')
    }
  }, [error])

  return (
    <Layout title=''>
      <div className='content-layout'>
        <h1 id='page-title' className='content__title'>
          Error
        </h1>
        <div className='content__body'>
          <p id='page-description'>
            <span>{error?.message}</span>
          </p>
        </div>
      </div>
    </Layout>
  )
}
