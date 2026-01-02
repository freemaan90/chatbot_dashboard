'use client'
import { useState } from "react";

interface Props {
    userId: number
}

export const AddressForm = ({ userId }: Props) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [form, setForm] = useState({
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "Argentina",
        country_code: "AR",
        type: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const body = {
                addresses: [form],
                userId
            }
            const res = await fetch("http://localhost:3000/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error("Error al agregar la direccion");
            setMessage("Direccion guardada correctamente");
            setForm({
                city: '',
                country: 'Argentina',
                country_code: 'AR',
                state: '',
                street: '',
                type: '',
                zip: ''
            })
        } catch (err: any) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    }

    return <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto p-6 bg-white shadow rounded flex flex-col gap-4"
    >

        <input
            type="text"
            name="street"
            placeholder="Calle y Numero"
            value={form.street}
            onChange={handleChange}
            className="border p-2 rounded"
            required
        />

        <input
            type="text"
            name="city"
            placeholder="Ciudad"
            value={form.city}
            onChange={handleChange}
            className="border p-2 rounded"
            required
        />

        <input
            type="text"
            name="state"
            placeholder="Provincia"
            value={form.state}
            onChange={handleChange}
            className="border p-2 rounded"
            required
        />

        <input
            type="text"
            name="zip"
            placeholder="Codigo Postal"
            value={form.zip}
            onChange={handleChange}
            className="border p-2 rounded"
            required
        />

        <input
            type="text"
            name="type"
            placeholder="Tipo"
            value={form.type}
            onChange={handleChange}
            className="border p-2 rounded"
            required
        />
        <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
            {loading ? "Guardando..." : "Guardar Direccion"}
        </button>

        {message && (
            <p className="text-center text-sm text-gray-700 mt-2">{message}</p>
        )}

    </form>
}
