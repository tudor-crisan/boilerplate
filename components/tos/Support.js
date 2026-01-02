"use client";
import { defaultSetting as settings } from "@/libs/defaults";
import TosWrapper from "@/components/tos/TosWrapper";
import Paragraph from "@/components/common/Paragraph";
import Title from "@/components/common/Title";
import TosContent from "@/components/tos/TosContent";
import { useStyling } from "@/context/ContextStyling";
import Link from "next/link";

export default function Support() {
  const { styling } = useStyling();

  return (
    <TosWrapper>
      <Title className="text-2xl sm:text-2xl">Support</Title>
      <TosContent>
        <Paragraph>
          Need help? We are here for you. Please reach out to us using the contact details below.
        </Paragraph>

        <div className={`${styling.components.card} mt-8 bg-base-200 ${styling.general.padding}`}>
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <Title>Contact Information</Title>
              <div className="space-y-4 mt-4">
                <div>
                  <span className="font-bold block text-xs opacity-70 uppercase tracking-wider mb-1">Email&nbsp;</span>
                  <Link href={`mailto:${settings.business.email}`} className={styling.links[0]}>
                    {settings.business.email}
                  </Link>
                </div>
                {settings.business.phone && (
                  <div>
                    <span className="font-bold block text-xs opacity-70 uppercase tracking-wider mb-1">Phone</span>
                    <Link href={`tel:${settings.business.phone}`} className={styling.links[0]}>
                      {settings.business.phone_display}
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Title>Business Details</Title>
              <div className="space-y-4 mt-4">
                <div>
                  <span className="font-bold block text-xs opacity-70 uppercase tracking-wider mb-1">Entity Name</span>
                  <p className="text-lg">{settings.business.entity_name}</p>
                </div>
                <div>
                  <span className="font-bold block text-xs opacity-70 uppercase tracking-wider mb-1">Address</span>
                  <p>
                    {settings.business.address_line1}<br />
                    {settings.business.address_line2}<br />
                    {settings.business.country}
                  </p>
                </div>
                <div>
                  <span className="font-bold block text-xs opacity-70 uppercase tracking-wider mb-1">Main Website</span>
                  <Link href={settings.business.website} className={styling.links[0]}>
                    {settings.business.website_display}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TosContent>
    </TosWrapper>
  )
}
