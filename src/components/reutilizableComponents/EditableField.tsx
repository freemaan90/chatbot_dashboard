"use client";

import { useState, useTransition } from "react";

interface EditableFieldProps {
  label: string;
  initialValue: string | number | null;
  placeholder?: string;
  type?: "text" | "number"; // 👈 agregado
  onSave: (value: string | number | null) => Promise<string | number | null>;
  onDelete: () => Promise<string | number | null>;
}

export function EditableField({
  label,
  initialValue,
  placeholder,
  type = "text",
  onSave,
  onDelete,
}: EditableFieldProps) {
  
  const initialString = initialValue !== null ? String(initialValue) : "";
  const [isEditing, setIsEditing] = useState(!initialString);
  const [value, setValue] = useState(initialString);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    setError(null);
    setMsg(null);

    startTransition(async () => {
      try {
        const cleaned = value.trim();

        let parsed: string | number | null = cleaned || null;

        // 👇 Si el tipo es number, convertir a número real
        if (type === "number" && cleaned !== "") {
          const n = Number(cleaned);
          parsed = isNaN(n) ? null : n;
        }

        const updatedValue = await onSave(parsed);

        setValue(updatedValue !== null ? String(updatedValue) : "");
        setMsg("Actualizado correctamente.");
        setIsEditing(false);
      } catch (e: any) {
        setError(e?.message ?? "No se pudo guardar.");
      }
    });
  };

  const handleDelete = () => {
    setError(null);
    setMsg(null);

    startTransition(async () => {
      try {
        const updatedValue = await onDelete();
        setValue(updatedValue !== null ? String(updatedValue) : "");
        setMsg("Eliminado correctamente.");
        setIsEditing(true);
      } catch (e: any) {
        setError(e?.message ?? "No se pudo eliminar.");
      }
    });
  };

  const handleCancel = () => {
    setError(null);
    setMsg(null);
    setValue(initialString);
    setIsEditing(false);
  };

  return (
    <div className="mt-4">
      <label className="block text-sm text-gray-700">{label}</label>

      {!isEditing ? (
        <div className="mt-2 flex items-center gap-2">
          <span className="font-medium">{value || "—"}</span>

          <button
            className="rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
            onClick={() => setIsEditing(true)}
          >
            Editar
          </button>

          <button
            className="rounded bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200"
            onClick={handleDelete}
            disabled={isPending || !value}
          >
            Eliminar
          </button>

          {msg && <p className="text-green-600 text-sm">{msg}</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
      ) : (
        <div className="mt-2">
          <input
            type={type} // 👈 ahora soporta number
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder={placeholder}
          />

          <div className="mt-2 flex gap-2">
            <button
              className="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 disabled:bg-blue-300"
              onClick={handleSave}
              disabled={isPending}
            >
              {isPending ? "Guardando…" : "Guardar"}
            </button>

            <button
              className="rounded bg-gray-100 px-3 py-2 hover:bg-gray-200"
              onClick={handleCancel}
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