"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLogin } from "@/hooks/useLogin";

export default function UserForm() {
  const router = useRouter();
  const { login } = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    phone: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    // Validación de password
    if (form.password !== form.confirmPassword) {
      setMessage("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      // 1. Crear usuario
      const { confirmPassword, ...formWidthoutConfirmPassword } = form;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formWidthoutConfirmPassword),
      });

      if (!res.ok) throw new Error("Error al crear usuario");

      // 2. Login automático usando el hook
      const logged = await login(form.email, form.password);

      if (!logged) {
        setMessage("Usuario creado, pero error al iniciar sesión");
        return;
      }

      // 3. Redirigir
      router.replace("/dashboard");
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white shadow rounded flex flex-col gap-4"
    >
      <input
        type="text"
        name="firstName"
        placeholder="Nombre"
        value={form.firstName}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />

      <input
        type="text"
        name="lastName"
        placeholder="Apellido"
        value={form.lastName}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />

      {/* Password */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-2 text-sm text-gray-600"
        >
          {showPassword ? "Ocultar" : "Mostrar"}
        </button>
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirmar Password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-2 text-sm text-gray-600"
        >
          {showPassword ? "Ocultar" : "Mostrar"}
        </button>
      </div>

      <input
        type="text"
        name="phone"
        placeholder="Teléfono"
        value={form.phone}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? "Guardando..." : "Crear Usuario"}
      </button>

      {message && (
        <p className="text-center text-sm text-red-600 mt-2">{message}</p>
      )}
    </form>
  );
}
