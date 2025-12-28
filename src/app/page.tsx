
// app/dashboard/page.tsx (Server Component)
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const accessToken = session.accessToken; // gracias a la module augmentation
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p>Bienvenido, {session.user?.name ?? session.user?.email}</p>
    </div>
  );
}
