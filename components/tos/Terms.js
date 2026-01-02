"use client";
import { defaultSetting as settings } from "@/libs/defaults";
import TosWrapper from "@/components/tos/TosWrapper";
import Title from "@/components/common/Title";
import Paragraph from "@/components/common/Paragraph";
import TosContent from "@/components/tos/TosContent";
import { useStyling } from "@/context/ContextStyling";
import Link from "next/link";

export default function Terms() {
  const { styling } = useStyling();

  return (
    <TosWrapper>
      <Title className="text-2xl sm:text-2xl">Terms of Service</Title>
      <TosContent>
        <Paragraph>Last updated: {settings.business.last_updated}</Paragraph>

        <Title>1. Introduction</Title>
        <p>
          Welcome to {settings.business.website_display} (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, &quot;us&quot;). By accessing or using our website,
          you agree to be bound by these Terms of Service and all applicable laws and regulations.
        </p>

        <Title>2. Governing Law</Title>
        <p>
          These Terms shall be governed and construed in accordance with the laws of {settings.business.country}, without regard to its conflict of law provisions.
        </p>

        <Title>3. Contact Us</Title>
        <p>
          If you have any questions about these Terms, please contact us at:
        </p>
        <p>
          <strong>Email:&nbsp;</strong>
          <Link href={`mailto:${settings.business.email}`} className={styling.components.link}>
            {settings.business.email}
          </Link>
        </p>
        <p>
          <strong>Address:</strong><br />
          {settings.business.entity_name}<br />
          {settings.business.address_line1}, {settings.business.address_line2}<br />
          {settings.business.country}
        </p>
      </TosContent>
    </TosWrapper>
  )
}
