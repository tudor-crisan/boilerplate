import { defaultSetting as settings } from "@/modules/general/libs/defaults";

export default function SupportContact() {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
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
