// hooks/useLogin.ts
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Credenciales incorrectas");
      setLoading(false);
      return false;
    }

    setLoading(false);
    return true;
  };

  return { login, loading, error };
}