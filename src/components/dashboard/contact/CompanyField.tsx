import { deleteCompany, updateCompany } from "@/app/dashboard/contact/actions";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function CompanyField({ contactId, initialValue }: { contactId: string; initialValue: string }) {
  const [isEditing, setIsEditing] = useState(!initialValue);
  const [value, setValue] = useState(initialValue);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter()

  const onSave = () => {
    setError(null); setMsg(null);
    startTransition(async () => {
      try {
        const company = value.trim() || null;
        const updated = await updateCompany(contactId, company);
        setValue(updated?.company ?? '');
        setMsg('Empresa actualizada.');
        setIsEditing(false);
      } catch (e: any) {
        setError(e?.message ?? 'No se pudo guardar la empresa.');
      }
    });
  };

  const onDelete = () => {
    setError(null); setMsg(null);
    startTransition(async () => {
      try {
        const updated = await deleteCompany(contactId);
        setValue(updated?.company ?? '');
        setMsg('Empresa eliminada.');
        setIsEditing(true)
      } catch (e: any) {
        setError(e?.message ?? 'No se pudo eliminar la empresa.');
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
      <label className="block text-sm text-gray-700">Empresa</label>
      {!isEditing ? (
        <div className="mt-2 flex items-center gap-2">
          <span className="font-medium">{value || '—'}</span>
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
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="Ingresa el nombre de la empresa"
          />
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