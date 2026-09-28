import { SignupForm } from '../../components/auth/SignupForm/SignupForm'
import { AuthLayout } from '../../components/common/AuthLayout'

export default function Signup() {
  return <AuthLayout title="Create your account" subtitle="Start booking flights with one simple account."><SignupForm /></AuthLayout>
}
