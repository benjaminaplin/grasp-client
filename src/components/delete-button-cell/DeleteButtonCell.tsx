import Button from "@mui/material/Button"
import DeleteIcon from '@mui/icons-material/Delete';
import { Row } from "@tanstack/react-table";

export const DeleteButtonCell =  ({row, deleteResource}:{row: Row<any>, deleteResource: (id: number) => void}) => {
  return (
    <Button
      color='warning'
      onClick={() => row.original.id ? deleteResource(row.original.id) : null} variant="outlined"
      ><DeleteIcon /></Button>
  )
}