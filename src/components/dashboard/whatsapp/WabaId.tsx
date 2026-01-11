'use client'
import { deleteWabaId, updateWabaId } from '@/app/dashboard/whatsapp/actions'
import { EditableField } from '@/components/reutilizableComponents/EditableField'

export const WabaId = ({whatsappId,initialValue}:{whatsappId: number, initialValue:string | null}) => {
  return (
    <EditableField
      label="Waba Id"
      initialValue={(initialValue)}
      placeholder="Ingresa el WABA_ID"
      onSave={(value) => updateWabaId(String(whatsappId),(value))}
      onDelete={() => deleteWabaId(String(whatsappId))}
    />
  )
}
