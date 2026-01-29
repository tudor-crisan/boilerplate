"use client";
import Paragraph from "@/modules/general/components/common/Paragraph";
import { useStyling } from "@/modules/general/context/ContextStyling";
import { defaultSetting as settings } from "@/modules/general/libs/defaults";
import Link from "next/link";

export default function FooterAuth() {
  const { styling } = useStyling();
  return (
    <div className="mt-8 text-center text-sm text-base-content/60">
      <Paragraph className="mb-2">
        By signing up, you agree to our{" "}
        <Link
          href={settings.paths.terms?.source}
          className={`${styling.components.link}`}
        >
          Terms of Service
        </Link>
        .
      </Paragraph>
      <Link
        href={settings.paths.support?.source}
        className={`${styling.components.link} ${styling.flex.center}`}
      >
        Need help?
      </Link>
    </div>
  );
}
