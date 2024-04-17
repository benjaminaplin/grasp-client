import Button from "@mui/material/Button"
import EditIcon from '@mui/icons-material/Edit';
import { Row } from "@tanstack/react-table";

export const EditButtonCell =  ({row , editResource}:{row: Row<any>, editResource: (id: number | undefined) => void}) => {
    return (
    <Button
      color='info'
      onClick={() => row.original.id ? editResource(row.original.id) : null} variant="outlined"
      ><EditIcon /></Button>
  )
}