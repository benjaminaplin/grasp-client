import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import PersonIcon from '@mui/icons-material/Person'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuIcon from '@mui/icons-material/Menu'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import {
  ArrowForward,
  Business,
  Dashboard,
  EmojiPeople,
  Work,
} from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import HandshakeIcon from '@mui/icons-material/Handshake'
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import { ColorModeContext } from '../../context/ColorMode'
import { Switch, useTheme } from '@mui/material'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorBoundaryFallback } from '../error/ErrorBoundaryFallback'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import './layout.css'
import { LogoutButton } from '../auth/LogoutButton'
import Modal from '@mui/material/Modal'
import { Profile } from '../auth/Profile'

const drawerWidth = 240

const menuItems = [
  {
    name: 'Dashboard',
    link: '/dashboard',
    icon: <Dashboard style={{ color: 'var(--green-blue)' }} />,
  },
  {
    name: 'Contacts',
    link: '/contacts',
    icon: <PersonIcon style={{ color: 'var(--green-blue)' }} />,
  },
  {
    name: 'Next Steps',
    link: '/next-steps',
    icon: <ArrowForward style={{ color: 'var(--green-blue)' }} />,
  },
  {
    name: 'Applications',
    link: '/job-applications',
    icon: <Work style={{ color: 'var(--green-blue)' }} />,
  },
  {
    name: 'Companies',
    link: '/companies',
    icon: <Business style={{ color: 'var(--green-blue)' }} />,
  },
  {
    name: 'Interviews',
    link: '/interviews',
    icon: <QuestionAnswerIcon style={{ color: 'var(--green-blue)' }} />,
  },
  {
    name: 'Touches',
    link: '/touches',
    icon: <EmojiPeople style={{ color: 'var(--green-blue)' }} />,
  },
]

export default function ResponsiveDrawer({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [isClosing, setIsClosing] = React.useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false)

  const colorMode = React.useContext(ColorModeContext)
  const theme = useTheme()

  const navigate = useNavigate()
  const handleDrawerClose = () => {
    setIsClosing(true)
    setMobileOpen(false)
  }
  const handleOpenProfileModal = () => {
    setIsProfileModalOpen(!isProfileModalOpen)
  }
  const handleDrawerTransitionEnd = () => {
    setIsClosing(false)
  }

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen)
    }
  }

  const drawer = (
    <div>
      <div className='grasp-title'>
        <HandshakeIcon /> Grasp
      </div>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton onClick={() => navigate(`${item.link}`)}>
              <ListItemIcon>
                <Link to={item.link}>{item.icon}</Link>
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  )

  return (
    <>
      <Box sx={{ display: 'flex', height: '100%' }}>
        <AppBar
          position='fixed'
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar
            style={{
              backgroundColor: 'var(--green-blue)',
              justifyContent: 'space-between',
            }}
          >
            <IconButton
              color='inherit'
              aria-label='open drawer'
              edge='start'
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant='h6' noWrap component='div'>
              {title}
            </Typography>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <DarkModeIcon />
              <Switch
                checked={theme.palette.mode === 'dark'}
                inputProps={{ 'aria-label': 'controlled' }}
                onClick={() => colorMode.toggleColorMode()}
              />
              <LogoutButton />
              <AccountBoxIcon
                onClick={() => handleOpenProfileModal()}
                sx={{ cursor: 'pointer' }}
              />
            </div>
          </Toolbar>
        </AppBar>
        <Box
          component='nav'
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label='mailbox folders'
        >
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            variant='temporary'
            open={mobileOpen}
            onTransitionEnd={handleDrawerTransitionEnd}
            onClose={handleDrawerClose}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant='permanent'
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component='main'
          sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
          <div className='layout-main'>
            <ErrorBoundary fallback={<ErrorBoundaryFallback />}>
              {children}
            </ErrorBoundary>
          </div>
        </Box>
      </Box>
      <Modal open={isProfileModalOpen} onClose={handleOpenProfileModal}>
        <Profile />
      </Modal>
    </>
  )
}
