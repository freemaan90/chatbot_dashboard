
// app/dashboard/contact/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import ListAddress from "@/components/dashboard/contact/ListAddress";
import type { Session } from "@/types/Session";
import { apiFetchJson } from "@/lib/api";
import { CompanyAndWebsite } from "@/components/dashboard/contact/CompanyAndWebsite";

export default async function ContactPage() {
  noStore();

  const session = (await getServerSession(authOptions)) as Session | null;
  if (!session) redirect("/login");

  const token = session.accessToken;
  if (!token) redirect("/login");

  let me = {
    user: session.user,
  } as any;

  // Si no existe contact, lo creo y luego releo el perfil
  if (!session.user.contact) {
    await apiFetchJson("/contact", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: { userId: Number(session.user.id) },
    });

    // Traigo el perfil fresco desde el backend
    me = await apiFetchJson("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    
  }

  const contact = me?.contact ?? session.user.contact ?? null;
  const addresses = contact?.addresses ?? [];
  const contactId = contact?.id ? String(contact.id) : "";

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold">Contacto</h2>
      <p className="mt-2 text-gray-600">Cargar Tarjeta de contacto</p>
      {/* ✅ Ya NO paso el accessToken al cliente */}
      <ListAddress addresses={addresses} contactId={contactId} />
      <CompanyAndWebsite contact={contact} />
    </div>
  );
}
