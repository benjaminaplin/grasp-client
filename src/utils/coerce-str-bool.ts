export const coerceStringToBool = (st: unknown) => {
  let inputValue

  if(typeof st === 'string' && (st === 'false' || st === 'true')){
    inputValue = st === 'true'
  } else {
    inputValue = st
  }
  return inputValue
}