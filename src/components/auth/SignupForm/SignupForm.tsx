import { type ChangeEvent, type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signupUser } from '../../../common/api/authApi'
import type { AuthCredentials } from '../../../common/types/auth'
import { Button } from '../../common/Button'
import { ErrorMessage } from '../../common/ErrorMessage/ErrorMessage'
import { Input } from '../../common/Input'

type FormErrors = Partial<Record<keyof AuthCredentials, string>>
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
function validate(values: AuthCredentials): FormErrors {
  const errors: FormErrors = {}
  if (!values.email.trim()) errors.email = 'Email is required.'
  else if (!emailPattern.test(values.email)) errors.email = 'Please enter a valid email address.'
  if (!values.password) errors.password = 'Password is required.'
  else if (values.password.length < 6 || values.password.length > 15) errors.password = 'Password must be between 6 and 15 characters.'
  return errors
}

export function SignupForm() {
  const navigate = useNavigate()
  const [values, setValues] = useState<AuthCredentials>({ email: '', password: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setApiError('')
  }
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const validationErrors = validate(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length) return
    setLoading(true)
    try {
      await signupUser(values)
      navigate('/login', { replace: true, state: { message: 'Account created. You can sign in now.' } })
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Unable to create your account. Please try again.')
    } finally { setLoading(false) }
  }
  return <form noValidate onSubmit={submit} className="space-y-5"><ErrorMessage message={apiError} /><Input label="Email" name="email" type="email" autoComplete="email" value={values.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" required /><Input label="Password" name="password" type="password" autoComplete="new-password" value={values.password} onChange={handleChange} error={errors.password} placeholder="6–15 characters" required minLength={6} maxLength={15} /><Button type="submit" loading={loading}>Create account</Button><p className="text-center text-sm text-slate-600">Already have an account? <Link className="font-semibold text-sky-700 hover:text-sky-600" to="/login">Sign in</Link></p></form>
}
