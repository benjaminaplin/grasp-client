import { Button, Toolbar, Typography } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'
import { PaginatedResponse } from '../../../types/paginatedResponse'

type TableToolBarType = {
  resource: any[] | undefined
  resourceName: string
  setIsFormOpen: () => void
  refetchResource: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<PaginatedResponse<any>, Error>>
  resourceNamePlural?: string
  resourceCount?: number
}

export const TableToolBar = ({
  resource,
  resourceName,
  resourceNamePlural,
  setIsFormOpen,
  refetchResource,
  resourceCount,
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
        <Typography variant='h6'>{`${resourceCount || resource?.length || 0} ${resourceNamePlural || `${resourceName}s`}`}</Typography>
      </div>
      <div className='table-action-bar-right'>
        <Button color='info' variant='contained' onClick={setIsFormOpen}>
          {`Add ${resourceName}`}
        </Button>
        <RefreshIcon
          sx={{ marginLeft: '.5rem', cursor: 'pointer' }}
          onClick={refetchResource || null}
        />
      </div>
    </Toolbar>
  )
}
