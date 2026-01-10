"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiFetchJson } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { Address } from "@/types/Address";

async function ensureAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) throw new Error("Unauthorized");
  return session.accessToken;
}

/** PATCH parcial: actualiza solo company */
export async function updateCompany(contactId: string, company: string | null) {
  const token = await ensureAuth();
  const payload = { company };
  return apiFetchJson(`/contact/${contactId}/company`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: payload,
    cache: "no-store",
  });
}

/** PATCH parcial: actualiza solo website */
export async function updateWebsite(contactId: string, website: string | null) {
  const token = await ensureAuth();
  const payload = { website };
  return apiFetchJson(`/contact/${contactId}/website`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: payload,
    cache: "no-store",
  });
}

/** “Eliminar” empresa = setear null */
export async function deleteCompany(contactId: string) {
  const token = await ensureAuth();
  const payload = {};
  const deleted = apiFetchJson(`/contact/${contactId}/company`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
    body: payload,
    cache: "no-store",
  });
  // ✅ Esto marca la ruta para revalidar SSR
  revalidatePath("/dashboard/contact");
  return deleted;
}

/** “Eliminar” website = setear null */
export async function deleteWebsite(contactId: string) {
  const token = await ensureAuth();
  const payload = {};
  const deleted = apiFetchJson(`/contact/${contactId}/website`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
    body: payload,
    cache: "no-store",
  });
  // ✅ Esto marca la ruta para revalidar SSR
  revalidatePath("/dashboard/contact");
  return deleted;
}

export async function saveAddressAction({
  form,
  contactId,
  editingId,
  accessToken,
}: {
  form: any;
  contactId: string;
  editingId?: string | number |null;
  accessToken?: string | null;
}): Promise<{ success: boolean; data?: Address; error?: string }> {
  try {
    const body = {
      street: form.street,
      city: form.city,
      state: form.state,
      zip: form.zip,
      country: form.country,
      country_code: form.country_code,
      type: form.type,
    };

    const isEditing = !!editingId;
    const path = isEditing
      ? `contact/${contactId}/addresses/${editingId}`
      : `contact/${contactId}/addresses`;

    const method = isEditing ? "PATCH" : "POST";

    const headers = {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };
    console.log(accessToken)
    const saved: Address = await apiFetchJson(path, {
      method,
      body,
      headers,
    });

    return { success: true, data: saved };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message ?? "No se pudo guardar la dirección.",
    };
  }
}

export async function deleteAddressAction({
  contactId,
  addressId,
  accessToken,
}: {
  contactId: string;
  addressId: string | number;
  accessToken?: string | null;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const path = `contact/${contactId}/addresses/${addressId}`;
    const method = "DELETE";
    console.log(accessToken)
    const headers = {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };

    await apiFetchJson(path, {
      method,
      body: {},
      headers,
    });

    return { success: true };
  } catch (err: any) {
    console.error(err.message)
    return {
      success: false,
      error: err?.message ?? "No se pudo eliminar la dirección.",
    };
  }
}