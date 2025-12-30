
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Importante: provider id = "credentials" (por defecto)
    const res = await signIn("credentials", {
      redirect: false,             // manejamos nosotros el redirect
      email: form.email,
      password: form.password,
      // opcional: callbackUrl: "/dashboard",
    });

    if (res?.error) {
      setMessage("Credenciales incorrectas");
      setLoading(false);
      return;
    }

    // OK → redirigir
    router.replace("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-6 shadow rounded">
      <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 rounded" required />
      <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="border p-2 rounded" required />
      <button type="submit" disabled={loading} className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
        {loading ? "Ingresando..." : "Ingresar"}
      </button>
      {message && <p className="text-center text-sm text-gray-700 mt-2">{message}</p>}
    </form>
  );
}
