
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

type FetchOptions = Omit<RequestInit, 'body'> & { body?: any };

export async function apiFetchJson<T = any>(path: string, options: FetchOptions = {}) {
  const url = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };

  const resp = await fetch(url, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    // credentials: options.credentials ?? 'include',
  });

  if (!resp.ok) {
    const errText = await resp.clone().text().catch(() => "");
    throw new Error(`Error ${resp.status}: ${errText}`);
  }

  return resp.json() as Promise<T>;
}
export async function apiFetchJsonSoft<T = any>(path: string, options: FetchOptions = {}) {
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';
    const url = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  
    const resp = await fetch(url, {
      ...options,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  
    const text = await resp.clone().text().catch(() => "");
    let data: any = null;
    try { data = JSON.parse(text); } catch { /* puede no ser JSON */ }
  
    return { ok: resp.ok, status: resp.status, data, raw: resp };
  }