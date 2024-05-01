import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorBoundaryFallback } from './components/error/ErrorBoundaryFallback.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary fallback={<ErrorBoundaryFallback />}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
