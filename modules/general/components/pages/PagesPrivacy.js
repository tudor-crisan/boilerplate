"use client";
import Paragraph from "@/modules/general/components/common/Paragraph";
import Title from "@/modules/general/components/common/Title";
import TosContent from "@/modules/general/components/tos/TosContent";
import TosWrapper from "@/modules/general/components/tos/TosWrapper";
import { useStyling } from "@/modules/general/context/ContextStyling";
import { defaultSetting as settings } from "@/modules/general/libs/defaults";
import Link from "next/link";

export default function PagesPrivacy() {
  const { styling } = useStyling();
  return (
    <TosWrapper>
      <Title className="text-2xl sm:text-2xl">Privacy Policy</Title>
      <TosContent>
        <Paragraph>Last updated: {settings.business.last_updated}</Paragraph>
        <Title>1. Introduction</Title>
        <p>
          At {settings.business.website_display}, we respect your privacy and
          are committed to protecting your personal data. This privacy policy
          will inform you as to how we look after your personal data when you
          visit our website and tell you about your privacy rights and how the
          law protects you.
        </p>
        <Title>2. Contact Details</Title>
        <p>
          Full name of legal entity: {settings.business.entity_name}
          <br />
          Email address:&nbsp;
          <Link
            href={`mailto:${settings.business.support_email}`}
            className={styling.components.link}
          >
            {settings.business.support_email}
          </Link>
          <br />
          Postal address: {settings.business.address_line1},{" "}
          {settings.business.address_line2}, {settings.business.country}
        </p>
        <Title>3. Data We Collect</Title>
        <p>
          We may collect, use, store and transfer different kinds of personal
          data about you which we have grouped together follows: Identity Data,
          Contact Data, Technical Data, Usage Data, and Marketing and
          Communications Data.
        </p>
        <Title>4. How We Use Your Data</Title>
        <p>
          We will only use your personal data when the law allows us to. Most
          commonly, we will use your personal data in the following
          circumstances: Where we need to perform the contract we are about to
          enter into or have entered into with you. Where it is necessary for
          our legitimate interests (or those of a third party) and your
          interests and fundamental rights do not override those interests.
          Where we need to comply with a legal or regulatory obligation.
        </p>
      </TosContent>
    </TosWrapper>
  );
}
