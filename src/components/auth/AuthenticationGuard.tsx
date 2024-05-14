import { withAuthenticationRequired } from '@auth0/auth0-react'
import { Loader } from '../loaders/Loader'

export const AuthenticationGuard = ({ component }: { component: any }) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => (
      <div className='page-layout'>
        <Loader />
      </div>
    ),
  })

  return <Component />
}
