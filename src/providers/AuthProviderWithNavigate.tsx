import { Auth0Provider } from '@auth0/auth0-react'
import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import.meta.env.REACT_APP_AUTH0_DOMAIN

export const Auth0ProviderWithNavigate = ({
  children,
}: {
  children: ReactNode
}) => {
  const navigate = useNavigate()

  const domain = import.meta.env.VITE_AUTH0_DOMAIN
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID
  const redirectUri = import.meta.env.VITE_AUTH0_CALLBACK_URL
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE

  const onRedirectCallback = (appState: any) => {
    console.log('navigating on redirect')
    navigate(appState?.returnTo || window.location.pathname)
  }

  if (!(domain && clientId && redirectUri)) {
    return null
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  )
}
