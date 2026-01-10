import { deleteWebsite, updateWebsite } from "@/app/dashboard/contact/actions";
import { useState, useTransition } from "react";

export function WebsiteField({ contactId, initialValue }: { contactId: string; initialValue: string }) {
  const [isEditing, setIsEditing] = useState(!initialValue);
  const [value, setValue] = useState(initialValue);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const validate = (url: string) => !url || /^https?:\/\/.+/i.test(url.trim());

  const onSave = () => {
    setError(null); setMsg(null);
    if (!validate(value)) {
      setError('El sitio web debe comenzar con http:// o https://');
      return;
    }
    startTransition(async () => {
      try {
        const website = value.trim() || null;
        const updated = await updateWebsite(contactId, website);
        setValue(updated?.website ?? '');
        setMsg('Website actualizado.');
        setIsEditing(false);
      } catch (e: any) {
        setError(e?.message ?? 'No se pudo guardar el website.');
      }
    });
  };

  const onDelete = () => {
    setError(null); setMsg(null);
    startTransition(async () => {
      try {
        const updated = await deleteWebsite(contactId);
        setValue(updated?.website ?? '');
        setMsg('Website eliminado.');
        setIsEditing(true)
      } catch (e: any) {
        setError(e?.message ?? 'No se pudo eliminar el website.');
      }
    });
  };

  const onCancel = () => {
    setError(null); setMsg(null);
    setValue(initialValue);
    setIsEditing(false);
  };

  return (
    <div className="mt-4">
      <label className="block text-sm text-gray-700">Website</label>
      {!isEditing ? (
        <div className="mt-2 flex items-center gap-2">
          {value ? (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {value}
            </a>
          ) : (
            <span className="font-medium">—</span>
          )}
          <button
            className="rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
            onClick={() => setIsEditing(true)}
          >
            Editar
          </button>
          <button
            className="rounded bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200"
            onClick={onDelete}
            disabled={isPending || !value}
            aria-disabled={isPending || !value}
          >
            Eliminar
          </button>
          {msg && <p className="text-green-600 text-sm">{msg}</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
      ) : (
        <div className="mt-2">
          <input
            type="url"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="https://miempresa.com"
          />
          <p className="text-gray-400 text-xs mt-1">
            Debe comenzar con <code>http://</code> o <code>https://</code>.
          </p>
          <div className="mt-2 flex gap-2">
            <button
              className="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 disabled:bg-blue-300"
              onClick={onSave}
              disabled={isPending}
            >
              {isPending ? 'Guardando…' : 'Guardar'}
            </button>
            <button
              className="rounded bg-gray-100 px-3 py-2 hover:bg-gray-200"
              onClick={onCancel}
              disabled={isPending}
            >
              Cancelar
            </button>
          </div>
          {msg && <p className="text-green-600 text-sm mt-1">{msg}</p>}
          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>
      )}
    </div>
  );
}