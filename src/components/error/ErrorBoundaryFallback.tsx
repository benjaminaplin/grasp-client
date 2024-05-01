import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import './error-boundary-fallback.css'

export const ErrorBoundaryFallback = () => {
  return (
    <div className='error-boundary-fallback '>
      <ReportProblemIcon sx={{
          color: 'error.main',
        }} fontSize='large'/>
      Hmm, sorry, looks like something went wrong.
    </div>
  )
}