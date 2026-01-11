import { EditableField } from "@/components/reutilizableComponents/EditableField";
import { updateCompany, deleteCompany } from "@/app/dashboard/contact/actions";

export function CompanyField({ contactId, initialValue }: { contactId: string; initialValue: string }) {
  return (
    <EditableField
      label="Empresa"
      initialValue={initialValue}
      placeholder="Ingresa el nombre de la empresa"
      onSave={(value) => updateCompany(contactId, value)}
      onDelete={() => deleteCompany(contactId)}
    />
  );
}