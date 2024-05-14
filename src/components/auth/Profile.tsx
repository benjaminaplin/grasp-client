import { useAuth0 } from '@auth0/auth0-react'
import Box from '@mui/material/Box'
const style = {
  position: 'absolute' as 'absolute',
  top: '25%',
  left: '85%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

export const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0()

  if (isLoading || !user) {
    return <div>Loading ...</div>
  }

  return (
    isAuthenticated && (
      <Box sx={style}>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </Box>
    )
  )
}
