import { isValid, parse } from "date-fns";

export const isValidDate = (date: string): boolean => {
  if(!date){
    return false
  }
  return isValid(date && parse(date, "dd/MM/yyyy", new Date()));
}