
// components/dashboard/contact/CompanyAndWebsite.tsx
'use client';

import { CompanyField } from './CompanyField';
import { WebsiteField } from './WebsiteField';

type ContactModel = {
  id: number;
  company?: string | null;
  website?: string | null;
};

type Props = { contact: ContactModel | null };

export const CompanyAndWebsite: React.FC<Props> = ({ contact }) => {
  if (!contact) {
    return (
      <div className="mt-6 rounded border p-4">
        <h3 className="text-lg font-medium">Empresa y Sitio web</h3>
        <p className="text-gray-600 mt-2">Aún no se creó el contacto para este usuario.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded border p-4">
      <h3 className="text-lg font-medium">Empresa y Sitio web</h3>
      <CompanyField contactId={String(contact.id)} initialValue={contact.company ?? ''} />
      <WebsiteField contactId={String(contact.id)} initialValue={contact.website ?? ''} />
    </div>
  );
};
