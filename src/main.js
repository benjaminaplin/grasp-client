'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
var react_1 = require('react')
var client_1 = require('react-dom/client')
var App_tsx_1 = require('./App.tsx')
require('./index.css')
var react_error_boundary_1 = require('react-error-boundary')
var ErrorBoundaryFallback_tsx_1 = require('./components/error/ErrorBoundaryFallback.tsx')
client_1.default.createRoot(document.getElementById('root')).render(
  <react_1.default.StrictMode>
    <react_error_boundary_1.ErrorBoundary
      fallback={<ErrorBoundaryFallback_tsx_1.ErrorBoundaryFallback />}
    >
      <App_tsx_1.default />
    </react_error_boundary_1.ErrorBoundary>
  </react_1.default.StrictMode>,
)
