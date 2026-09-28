export interface AuthCredentials { email: string; password: string }
export interface ApiEnvelope<T> { success: boolean; message: string; data: T; error: unknown }
