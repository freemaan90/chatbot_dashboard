
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiUser, FiMapPin, FiMessageCircle, FiMenu } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

type Props = {
    userName?: string;
};

const navItems = [
    { href: "/dashboard/contact", label: "Contacto", icon: FiUser },
    { href: "/dashboard/location", label: "Ubicación", icon: FiMapPin },
    { href: "/dashboard/whatsapp", label: "Whatsapp", icon: FaWhatsapp },
    { href: "/dashboard/chatbot", label: "ChatBot", icon: FiMessageCircle },
];


export default function Sidebar({ userName = "Usuario" }: Props) {
    const pathname = usePathname();
    const [open, setOpen] = useState(true); // colapsable para mobile

    return (
        <>
            {/* Toggle visible en pantallas chicas */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 inline-flex items-center gap-2 bg-white shadow px-3 py-2 rounded"
                onClick={() => setOpen((o) => !o)}
                aria-label="Abrir/cerrar menú"
            >
                <FiMenu />
                <span>Menú</span>
            </button>

            <aside
                className={`${open ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0 transition-transform duration-200 ease-in-out
          w-64 bg-white border-r shadow-sm fixed md:static inset-y-0 left-0 z-40`}
            >
                {/* Header del sidebar */}
                <div className="h-16 flex items-center justify-between px-4 border-b">
                    <div>
                        <p className="text-sm text-gray-500">Bienvenido</p>
                        <p className="text-base font-semibold text-gray-800">{userName}</p>
                    </div>
                </div>

                {/* Navegación */}
                <nav className="p-3 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm
                  ${active ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-100"}
                `}
                            >
                                <Icon className={active ? "text-blue-600" : "text-gray-500"} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

        </>
    );
}
