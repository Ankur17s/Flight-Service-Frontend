const TOKEN_KEY = 'flight_booking_access_token'
export const saveAuthToken = (token: string) => localStorage.setItem(TOKEN_KEY, token)
export const getAuthToken = () => localStorage.getItem(TOKEN_KEY)
export const hasAuthToken = () => Boolean(getAuthToken())
export const clearAuthToken = () => localStorage.removeItem(TOKEN_KEY)