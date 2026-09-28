import { useLocation } from "react-router-dom";
import { LoginForm } from "../../components/auth/LoginForm/LoginForm";
import { AuthLayout } from "../../components/common/AuthLayout";

export default function Login() {
  const location = useLocation();
  const message = (location.state as { message?: string } | null)?.message;
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue planning your next journey."
    >
      {message && (
        <p
          role="status"
          className="mb-5 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
        >
          {message}
        </p>
      )}
      <LoginForm />
    </AuthLayout>
  );
}
