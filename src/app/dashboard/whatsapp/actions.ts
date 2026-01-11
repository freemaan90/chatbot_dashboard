"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiFetchJson } from "@/lib/api";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { log } from "node:console";

async function ensureAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) throw new Error("Unauthorized");
  return session.accessToken;
}

export async function updateWabaId(whatsappId: string, wabaId: string| number | null) {
  const token = await ensureAuth();
  const updated = await apiFetchJson(`/user/${whatsappId}/waba_id`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: { wabaId },
    cache: "no-store",
  });

  return updated.waba_id
}

export async function updateBussinesPhone(whatsappId: string, bussinesPhone: string | number | null) {
  const token = await ensureAuth();
  const updated = await apiFetchJson(`/user/${whatsappId}/bussines_phone`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: { bussinesPhone },
    cache: "no-store",
  });
  return updated.bussines_phone
}

export async function deleteBussinesPhone(whatsappId: string) {
  const token = await ensureAuth();
  await apiFetchJson(`/user/${whatsappId}/bussinesPhone`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  
  return null
}

export async function deleteWabaId(whatsappId: string) {
  const token = await ensureAuth();
  await apiFetchJson(`/user/${whatsappId}/wabaId`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return null
}