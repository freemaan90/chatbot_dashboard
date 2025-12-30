
"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <nav className="w-full border-b bg-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        {/* Logo / Home */}
        <div className="flex items-center gap-3">
          <Link href="/" className="font-semibold">
            Mi App
          </Link>
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-black">
            Dashboard
          </Link>
        </div>

        {/* Estado de sesión */}
        <div className="flex items-center gap-3">
          {loading && <span className="text-sm text-gray-500">Cargando…</span>}

          {!loading && !session && (
            <>
              <button
                onClick={() => signIn()} // abre la página de login o el modal del provider
                className="rounded bg-black px-3 py-1.5 text-white text-sm"
              >
                Iniciar sesión
              </button>
              <Link href="/register" className="text-sm text-gray-700 hover:text-black">
                Registrarse
              </Link>
            </>
          )}

          {!loading && session && (
            <>
              <div className="flex items-center gap-2">
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user?.name ?? "Usuario"}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                    {session.user?.name?.[0] ?? "U"}
                  </div>
                )}
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-medium">
                    {session.user?.name ?? session.user?.email}
                  </span>
                  <span className="text-xs text-gray-500">{session.user?.email}</span>
                </div>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
