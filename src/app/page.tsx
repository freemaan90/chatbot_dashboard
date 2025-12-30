
// app/dashboard/page.tsx (Server Component)
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  if (!session) redirect("/login");

  const accessToken = session.accessToken;
  if(accessToken){
    redirect(`/dashboard`)
  }
  
  return <></>
}
