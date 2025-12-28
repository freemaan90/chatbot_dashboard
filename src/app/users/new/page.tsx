import UserForm from "@/components/users/UserForm";

export default function NewUserPage() {
  return (
    <div className="p-10">
      <h1 className="text-2xl text-black font-bold mb-6">Alta de Usuario</h1>
      <UserForm />
    </div>
  );
}