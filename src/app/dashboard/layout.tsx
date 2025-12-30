
// app/dashboard/layout.tsx
import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Sidebar from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar fijo a la izquierda */}
      <Sidebar userName={session.user?.name ?? "Usuario"} />

      {/* Contenido principal */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
