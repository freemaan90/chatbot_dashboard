import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Iniciar Sesión</h1>
      <LoginForm />
    </div>
  );
}