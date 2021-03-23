import { IGetDocumentsResponse } from '@pm-react-example/shared'

const {
  REACT_APP_API_URL = 'http://localhost:3400'
} = process.env

export async function getDocuments() : Promise<IGetDocumentsResponse> {
  const resp = await fetch(`${REACT_APP_API_URL}/docs`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
  return await resp.json()
}
