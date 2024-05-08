import { ReactNode } from 'react'
import Box from '@mui/material/Box'

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  bgcolor: 'background.paper',
}

export const FormContainer = ({ children }: { children: ReactNode }) => {
  return (
    <Box my={4} gap={4} p={2} sx={style}>
      {children}
    </Box>
  )
}
