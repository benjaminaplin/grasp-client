import { useLocation } from 'react-router-dom'
import Layout from '../layout/Layout'
import { useQuery } from '@tanstack/react-query'
import { camelToHuman } from '../../utils/camel-to-human'
import { getBaseUrl } from '../../service/getUrl'

export const ResourceView = ({
  relation,
}: {
  relation?: string | string[]
}) => {
  const location = useLocation()

  const { data } = useQuery({
    queryKey: [location.pathname],
    queryFn: () =>
      fetch(`${getBaseUrl()}${location.pathname}`).then((res: any) => {
        return res.json()
      }),
  })

  const title = data?.firstName
    ? `${data.firstName} ${data.lastName}`
    : data?.name || data?.id
  return (
    <Layout title={title}>
      <>
        {data ? (
          <div style={{ margin: '1rem 0' }}>
            {Object.entries(data).map((entry: any[]) => {
              if (entry[0] === relation) {
                return (
                  <div key={entry[1]}>
                    <h2>
                      {typeof relation === 'string'
                        ? camelToHuman(relation)
                        : ''}
                    </h2>
                    {entry[1].map((subEntryMap: any[]) => {
                      return Object.entries(subEntryMap).map(
                        (subEntry: any[]) => {
                          return (
                            <div
                              style={{ marginLeft: '1rem' }}
                              key={subEntry[0]}
                            >
                              <span>{subEntry[0]}</span>
                              <span style={{ marginLeft: '1rem' }}>
                                {subEntry[1]}
                              </span>
                            </div>
                          )
                        },
                      )
                    })}
                  </div>
                )
              }
              return (
                <div key={entry[0]}>
                  <span>{entry[0]}</span>
                  <span style={{ marginLeft: '1rem' }}>{entry[1]}</span>
                </div>
              )
            })}
          </div>
        ) : null}
      </>
    </Layout>
  )
}
