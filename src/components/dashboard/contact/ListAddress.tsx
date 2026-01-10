"use client";

import { Address } from "@/types/Address";
import { useState } from "react";
import { FORM_INITIAL_STATE } from "./utils/FormInitialState";
import {
  deleteAddressAction,
  saveAddressAction,
} from "@/app/dashboard/contact/actions";
// Opcional si querés refrescar data del server luego de cambios:
// import { useRouter } from "next/navigation";

interface Props {
  addresses: Address[];
  accessToken?: string;
  contactId: string;
}

type AddressForm = Partial<Address>;

export default function ListAddress({
  addresses,
  accessToken,
  contactId,
}: Props) {
  const [items, setItems] = useState<Address[]>(addresses ?? []);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [form, setForm] = useState<AddressForm>(FORM_INITIAL_STATE);
  const [error, setError] = useState<string | null>(null);
  // const router = useRouter();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(FORM_INITIAL_STATE);
    setOpen(true);
  };

  const openEdit = (address: Address) => {
    setEditingId(address.id ?? null);
    setForm({
      street: address.street ?? "",
      city: address.city ?? "",
      state: address.state ?? "",
      zip: address.zip ?? "",
      country: address.country ?? "",
      country_code: address.country_code ?? "",
      type: address.type ?? "",
    });
    setOpen(true);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await saveAddressAction({
      form,
      contactId,
      editingId,
      accessToken,
    });

    if (!result.success) {
      setError(result.error!);
      setLoading(false);
      return;
    }

    const saved = result.data!;

    // Optimistic update
    if (editingId) {
      setItems((prev) =>
        prev.map((it) => (String(it.id) === String(saved.id) ? saved : it))
      );
    } else {
      setItems((prev) => [saved, ...prev]);
    }

    setOpen(false);
    setEditingId(null);
    setForm(FORM_INITIAL_STATE);
    setLoading(false);
  };

  const onDelete = async (addressId: string | number) => {
    const confirmDelete = window.confirm(
      "¿Seguro que querés eliminar esta dirección?"
    );
    if (!confirmDelete) return;

    setLoading(true);
    setError(null);

    const result = await deleteAddressAction({
      contactId,
      addressId,
      accessToken,
    });

    if (!result.success) {
      setError(result.error!);
      setLoading(false);
      return;
    }

    // Optimistic update
    setItems((prev) =>
      prev.filter((it) => String(it.id) !== String(addressId))
    );

    setLoading(false);
  };

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Direcciones</h2>
        <button
          onClick={openCreate}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Agregar otra dirección
        </button>
      </header>

      {/* Lista */}
      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-gray-500">
          No tenés direcciones guardadas aún.
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((address) => (
            <li
              key={String(address.id ?? `${address.street}-${address.city}`)}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-900 font-medium">{address.street}</p>
                  <p className="text-gray-600 text-sm">
                    {[address.city, address.state, address.zip]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  {address.country && (
                    <p className="text-gray-500 text-xs mt-1">
                      {address.country}
                    </p>
                  )}
                  {address.type && (
                    <p className="text-gray-400 text-xs mt-1">
                      Tipo: {address.type}
                    </p>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(address)}
                    className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                    aria-label="Editar dirección"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(address.id!)}
                    className="rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
                    aria-label="Eliminar dirección"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {editingId ? "Editar dirección" : "Nueva dirección"}
              </h3>
              <button
                onClick={() => {
                  setOpen(false);
                  setEditingId(null);
                  setForm(FORM_INITIAL_STATE);
                }}
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-3 rounded-md bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Calle
                </label>
                <input
                  name="street"
                  value={form.street ?? ""}
                  onChange={onChange}
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Ej: Av. Santa Fe 1234"
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ciudad
                  </label>
                  <input
                    name="city"
                    value={form.city ?? ""}
                    onChange={onChange}
                    required
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Ej: CABA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Provincia/Estado
                  </label>
                  <input
                    name="state"
                    value={form.state ?? ""}
                    onChange={onChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Ej: Buenos Aires"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Código postal
                  </label>
                  <input
                    name="zip"
                    value={form.zip ?? ""}
                    onChange={onChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Ej: 1425"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    País
                  </label>
                  <input
                    name="country"
                    value={form.country ?? ""}
                    onChange={onChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Ej: Argentina"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Código país
                  </label>
                  <input
                    name="country_code"
                    value={form.country_code ?? ""}
                    onChange={onChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Ej: AR"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tipo
                  </label>
                  <input
                    name="type"
                    value={form.type ?? ""}
                    onChange={onChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Ej: Residencia"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setEditingId(null);
                    setForm(FORM_INITIAL_STATE);
                  }}
                  className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
                >
                  {loading
                    ? editingId
                      ? "Guardando cambios..."
                      : "Guardando..."
                    : editingId
                    ? "Guardar cambios"
                    : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
