'use client'
import { deleteBussinesPhone, updateBussinesPhone } from '@/app/dashboard/whatsapp/actions';
import { EditableField } from '@/components/reutilizableComponents/EditableField';

export const BussinesPhone = ({whatsappId,initialValue}:{whatsappId: number, initialValue:string | null}) => {
  return (
    <EditableField
      label="Bussines Phone"
      initialValue={(initialValue)}
      placeholder="Ingrese el numero de telefono empresa"
      onSave={(value) => updateBussinesPhone(String(whatsappId),(value))}
      onDelete={() => deleteBussinesPhone(String(whatsappId))}
    />
  );
}
