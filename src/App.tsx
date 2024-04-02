import './App.css'
import Layout from './components/layout/Layout';
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
import { Companies } from './pages/companies';
import { ResourceView } from './components/resource-view/ResourceView';
import {NextSteps} from './pages/next-steps';
import { Dashboard } from './pages/dashboard';
import {Interviews} from './pages/interviews';


const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/contacts/:id" element={<ResourceView relation='nextSteps'/>} />
          <Route path="/next-steps" element={<NextSteps />} />
          <Route path="/next-steps/:id" element={<ResourceView />} />
          <Route path="/job-applications" element={<Applications />} />
          <Route path="/interviews" element={<Interviews />} />
          <Route path="/job-applications/:id" element={<ResourceView />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:id" element={<ResourceView />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App

const NoMatch = () => <Layout title=""><div>Nothing to see here</div></Layout>
