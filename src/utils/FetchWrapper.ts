interface Props {
    path: string
    body: any
    method: string
    accessToken: string | undefined
}
const FetchWrapper = async ({ path, method, accessToken, body }: Props) => {
    const url = `${process.env.API_URL}/${path}`
    const res = await fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: body
    })

    if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(`Error al guardar: ${res.status} ${errText}`);
    }

    return res
}