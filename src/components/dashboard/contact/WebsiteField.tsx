import { deleteWebsite, updateWebsite } from "@/app/dashboard/contact/actions";
import { EditableField } from "@/components/reutilizableComponents/EditableField";

export function WebsiteField({ contactId, initialValue }: { contactId: string; initialValue: string }) {
    return (
      <EditableField
        label="Website"
        initialValue={initialValue}
        placeholder="https://www.google.com"
        onSave={(value) => updateWebsite(contactId, value)}
        onDelete={() => deleteWebsite(contactId)}
      />
    );
}