import { useLocation, useParams } from "react-router-dom"
import LeftDrawer from "../../features/left-drawer/LeftDrawer"
import { useQuery } from "@tanstack/react-query"
const DEV_API_URL = import.meta.env.VITE_DEV_API_URL

export const ResourceView = () => {
  const params = useParams()
  const location = useLocation()
  console.log("location", location)

  const { data } = useQuery({
    queryKey: [location.pathname],
    queryFn: () => fetch(`${DEV_API_URL}${location.pathname}`).then((res: any) => {
      return res.json()
    }),
  })
console.log('data', data)
  return (
    <LeftDrawer>
      {data && <div style={{margin: '1rem 0'}}>
      {Object.entries(data).map((entry: any[])=>{
        return (
          <div>
              <span>{entry[0]}</span>
              <span style={{marginLeft: '1rem'}}>{entry[1]}</span>
          </div>
        )
      })}
      </div>}
    </LeftDrawer>
  )
}