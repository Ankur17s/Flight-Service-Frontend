import axios from 'axios'
import { getAuthToken } from '../auth/authStorage'

// Vite proxies /api to the gateway during development; set VITE_API_BASE_URL when deployed.
const apiClient = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api', headers: { 'Content-Type': 'application/json' } })
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) config.headers.set('x-access-token', token)
  return config
})
export default apiClient
