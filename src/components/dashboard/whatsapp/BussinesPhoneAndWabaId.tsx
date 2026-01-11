import { BussinesPhone } from "./BussinesPhone";
import { WabaId } from "./WabaId";

type WhatsAppModel = {
  id: number,
  bussines_phone: string | null,
  waba_id: string | null
}

type Props = { whatsapp: WhatsAppModel | null }

export const BussinesPhoneAndWabaId: React.FC<Props> = ({whatsapp}) => {
    if (!whatsapp) {
    return (
      <div className="mt-6 rounded border p-4">
        <h3 className="text-lg font-medium">BussinesPhone y WabaId</h3>
      </div>
    );
  }
  return (
    <div className="mt-6 rounded border p-4">
      <h3 className="text-lg font-medium">BussinesPhone y WabaId</h3>
      <BussinesPhone initialValue={whatsapp.bussines_phone} whatsappId={whatsapp.id} />
      <WabaId initialValue={whatsapp.waba_id} whatsappId={whatsapp.id} />
    </div>
  )
}
