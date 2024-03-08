import './App.css'
import { TopBar } from './features/app-bar/TopBar'
import { HomePage } from './pages/home-page'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TopBar />
      <HomePage/>
    </QueryClientProvider>
  )
}

export default App
