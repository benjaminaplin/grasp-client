import './App.css'
import Layout from './components/layout/Layout'
import { Applications } from './pages/applications'
import { Contacts } from './pages/contacts'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Companies } from './pages/companies'
import { ResourceView } from './components/resource-view/ResourceView'
import { NextSteps } from './pages/next-steps'
import { Dashboard } from './pages/dashboard'
import { Interviews } from './pages/interviews'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { PaletteMode } from '@mui/material'
import { grey, amber } from '@mui/material/colors'
import { useMemo } from 'react'
import { ColorModeContext } from './context/ColorMode'
import { Touches } from './pages/touches'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider'
import { ContactDetails } from './pages/contact-details'
import { RowData } from '@tanstack/react-table'
import { useLocalStorage } from 'usehooks-ts'
import { faker } from '@faker-js/faker'

declare module '@tanstack/react-table' {
  // eslint ignore is needed because TS needs these parameters
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }
}

const queryClient = new QueryClient()

const palette = {
  light: {
    primary: {
      main: '#34C0AC',
      light: '#B1DED3',
      dark: '#00765A',
    },
  },
}
const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // palette values for light mode
          primary: amber,
          divider: amber[200],
          text: {
            primary: grey[900],
            secondary: grey[800],
          },
          error: {
            main: '#ffae00',
          },
        }
      : {
          // palette values for dark mode
          primary: {
            main: palette.light.primary.main,
            light: palette.light.primary.light,
            dark: palette.light.primary.dark,
          },
          divider: 'rgba(255, 255, 255, 0.12)',
          background: {
            default: '#121212',
            paper: '#121212',
          },
          text: {
            primary: '#fff',
            secondary: 'rgba(255, 255, 255, 0.7)',
            disabled: 'rgba(255, 255, 255, 0.5)',
          },
          action: {
            active: '#fff',
            hover: 'rgba(255, 255, 255, 0.08)',
            selected: 'rgba(255, 255, 255, 0.16)',
            disabled: 'rgba(255, 255, 255, 0.3)',
            disabledBackground: 'rgba(255, 255, 255, 0.12)',
          },
          error: {
            main: '#ffae00',
          },
        }),
  },
})

function App() {
  const [mode, setMode] = useLocalStorage<PaletteMode>('mode', 'light')

  const colorMode = useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) =>
          prevMode === 'light' ? 'dark' : 'light',
        )
      },
    }),
    [],
  )
  console.log('faker', faker.person.firstName())
  console.log('faker', faker.person.lastName())
  console.log('faker', faker.person.jobTitle())
  console.log('faker', faker.person.jobDescriptor())
  // Update the theme only if the mode changes
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode])

  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
              <Routes>
                <Route path='/' element={<Dashboard />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/contacts' element={<Contacts />} />
                <Route path='/contacts/:id' element={<ContactDetails />} />
                <Route path='/next-steps' element={<NextSteps />} />
                <Route path='/next-steps/:id' element={<ResourceView />} />
                <Route path='/job-applications' element={<Applications />} />
                <Route path='/interviews' element={<Interviews />} />
                <Route
                  path='/job-applications/:id'
                  element={<ResourceView />}
                />
                <Route path='/companies' element={<Companies />} />
                <Route path='/companies/:id' element={<ResourceView />} />
                <Route path='/touches' element={<Touches />} />
                <Route path='/touches/:id' element={<ResourceView />} />
                <Route path='*' element={<NoMatch />} />
              </Routes>
            </BrowserRouter>
          </ThemeProvider>
        </ColorModeContext.Provider>
      </LocalizationProvider>
    </QueryClientProvider>
  )
}

export default App

const NoMatch = () => (
  <Layout title=''>
    <div>Nothing to see here</div>
  </Layout>
)
