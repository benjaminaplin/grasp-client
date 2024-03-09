import './App.css'
import LeftDrawer from './features/left-drawer/LeftDrawer';
import {Applications} from './pages/applications';
import { Contacts } from './pages/contacts'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Contacts />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/next-steps" element={<NextSteps />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App

const NoMatch = () => <LeftDrawer><div>Nothing to see here</div></LeftDrawer>
const NextSteps = () => <LeftDrawer><div>Next Steps</div></LeftDrawer>
const Companies = () => <LeftDrawer><div>Companies</div></LeftDrawer>