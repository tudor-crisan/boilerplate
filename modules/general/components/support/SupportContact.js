import { defaultSetting as settings } from "@/modules/general/libs/defaults";

export default function SupportContact({ className = "" }) {
  return (
    <div
      className={`flex justify-center sm:justify-start items-center gap-2 text-sm text-gray-500 ${className}`}
    >
      <span className="font-semibold text-gray-900 dark:text-gray-100">
        Email:
      </span>
      <a
        href={`mailto:${settings.business.support_email}`}
        className="hover:underline"
      >
        {settings.business.support_email}
      </a>
    </div>
  );
}
