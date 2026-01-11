import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BussinesPhoneAndWabaId } from "@/components/dashboard/whatsapp/BussinesPhoneAndWabaId";
import { apiFetchJson } from "@/lib/api";
import { WhatsApp } from "@/types/WhatsApp";
import { getServerSession, Session } from "next-auth";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";

export default async function WhatsappPage() {
  noStore();
  const session = (await getServerSession(authOptions)) as Session | null;

  if (!session) redirect("/login");

  const token = session.accessToken;
  if (!token) redirect("/login");

  let me = {
    user: session.user,
  } as any;

  // Traigo el perfil fresco desde el backend
  me = await apiFetchJson("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const whatsapp: WhatsApp = me?.whatsapp ?? session?.user?.whatsapp ?? null;

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold">Whatsapp</h2>
      <BussinesPhoneAndWabaId whatsapp={whatsapp} />
    </div>
  );
}
