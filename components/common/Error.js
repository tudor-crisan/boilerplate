import SvgError from "@/components/svg/SvgError";

export default function Error({ message, className = "" }) {
  if (!message) return null;

  return (
    <div className={`alert alert-error mb-4 flex flex-row items-center gap-2 p-3 text-sm rounded-lg bg-error/10 text-red-500 ${className}`}>
      <SvgError className="w-5 h-5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
