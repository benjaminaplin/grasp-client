import { Button, Toolbar, Typography } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'

type TableToolBarType = {
  resource: any[] | undefined
  resourceName: string
  setIsFormOpen: () => void
  refetchResource: () => void
  resourceNamePlural?: string
}

export const TableToolBar = ({
  resource,
  resourceName,
  resourceNamePlural,
  setIsFormOpen,
  refetchResource,
}: TableToolBarType) => {
  return (
    <Toolbar
      style={{ padding: 0 }}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '.5rem',
      }}
    >
      <div className='table-action-bar-left'>
        <Typography variant='h6'>{`${resource?.length || 0} ${resourceNamePlural || `${resourceName}s`}`}</Typography>
      </div>
      <div className='table-action-bar-right'>
        <Button color='info' variant='contained' onClick={setIsFormOpen}>
          {`Add ${resourceName}`}
        </Button>
        <RefreshIcon sx={{ marginLeft: '.5rem' }} onClick={refetchResource} />
      </div>
    </Toolbar>
  )
}
