
'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { apiFetchJson } from '@/lib/api';
import { revalidatePath } from 'next/cache';

async function ensureAuth() {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) throw new Error('Unauthorized');
    return session.accessToken;
}

/** PATCH parcial: actualiza solo company */
export async function updateCompany(contactId: string, company: string | null) {
    const token = await ensureAuth();
    const payload = { company };
    return apiFetchJson(`/contact/${contactId}/company`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
        cache: 'no-store',
    });
}

/** PATCH parcial: actualiza solo website */
export async function updateWebsite(contactId: string, website: string | null) {
    const token = await ensureAuth();
    const payload = { website };
    return apiFetchJson(`/contact/${contactId}/website`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
        cache: 'no-store',
    });
}


/** “Eliminar” empresa = setear null */
export async function deleteCompany(contactId: string) {
    const token = await ensureAuth();
    const payload = {};
    const deleted = apiFetchJson(`/contact/${contactId}/company`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
        cache: 'no-store',
    });
    // ✅ Esto marca la ruta para revalidar SSR
    revalidatePath('/dashboard/contact');
    return deleted

}

/** “Eliminar” website = setear null */
export async function deleteWebsite(contactId: string) {
    const token = await ensureAuth();
    const payload = {};
    const deleted = apiFetchJson(`/contact/${contactId}/website`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
        cache: 'no-store',
    });
    // ✅ Esto marca la ruta para revalidar SSR
    revalidatePath('/dashboard/contact');
    return deleted
}
