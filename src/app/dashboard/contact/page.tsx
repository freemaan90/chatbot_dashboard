import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AddressForm } from "@/components/dashboard/contact/AddressForm";
import { ListAddress } from "@/components/dashboard/contact/ListAddress";


export default async function ContactPage() {
  const session = await getServerSession(authOptions);
  console.log(session?.user);

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold">Contacto</h2>
      <p className="mt-2 text-gray-600">Cargar Tarjeta de contacto</p>
      {!session?.user.contact ? <AddressForm userId={Number(session?.user.id)!} /> : <ListAddress />}
    </div>
  );
}
