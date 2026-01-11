export const Footer = () => {
  return (
    <div className="mt-auto p-3 text-xs text-gray-400 hidden md:block text-center w-full">
      © {new Date().getFullYear()} FZolutions
    </div>
  );
};