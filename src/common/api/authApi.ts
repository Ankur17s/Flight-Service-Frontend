import axios from 'axios'
import type { ApiEnvelope, AuthCredentials } from '../types/auth'
import apiClient from './apiClient'

type BackendError = { message?: string; error?: { explanation?: string | string[]; message?: string } }

export class AuthApiError extends Error {}
function getErrorMessage(error: unknown) {
  if (!axios.isAxiosError<BackendError>(error)) return 'Unable to reach the server. Please check your connection and try again.'
  const body = error.response?.data
  const explanation = body?.error?.explanation ?? body?.error?.message
  if (Array.isArray(explanation)) return explanation.join('. ')
  if (typeof explanation === 'string') return explanation
  if (error.response?.status === 409) return 'An account with this email already exists.'
  if (error.response?.status && error.response.status >= 500) return 'The server could not complete your request. Please try again later.'
  return body?.message ?? 'Your request could not be completed. Please review your details and try again.'
}
export async function signupUser(credentials: AuthCredentials) {
  try { return (await apiClient.post<ApiEnvelope<unknown>>('/v1/user/signup', credentials)).data } catch (error) { throw new AuthApiError(getErrorMessage(error)) }
}
export async function loginUser(credentials: AuthCredentials) {
  try { return (await apiClient.post<ApiEnvelope<string>>('/v1/user/signin', credentials)).data } catch (error) { throw new AuthApiError(getErrorMessage(error)) }
}
