
"use client";
import useSettings from "@/hooks/useSettings";
import TosWrapper from "@/components/tos/TosWrapper";

export default function TosPrivacy() {
  const settings = useSettings();

  return (
    <TosWrapper>
      <h1 className="md:text-3xl text-2xl font-extrabold leading-none mb-6">Privacy Policy</h1>
      <div className="space-y-4 leading-relaxed opacity-90 text-base-content">
        <p>Last updated: {settings.business.last_updated}</p>

        <h2 className="text-xl font-bold mt-6 text-base-content">1. Introduction</h2>
        <p>
          At {settings.business.website_display}, we respect your privacy and are committed to protecting your personal data.
          This privacy policy will inform you as to how we look after your personal data when you visit our website
          and tell you about your privacy rights and how the law protects you.
        </p>

        <h2 className="text-xl font-bold mt-6 text-base-content">2. Contact Details</h2>
        <p>
          Full name of legal entity: {settings.business.entity_name}<br />
          Email address: <a href={`mailto:${settings.business.email}`} className="link link-hover link-primary">{settings.business.email}</a><br />
          Postal address: {settings.business.address_line1}, {settings.business.address_line2}, {settings.business.country}
        </p>

        <h2 className="text-xl font-bold mt-6 text-base-content">3. Data We Collect</h2>
        <p>
          We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
          Identity Data, Contact Data, Technical Data, Usage Data, and Marketing and Communications Data.
        </p>

        <h2 className="text-xl font-bold mt-6 text-base-content">4. How We Use Your Data</h2>
        <p>
          We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          Where we need to perform the contract we are about to enter into or have entered into with you.
          Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.
          Where we need to comply with a legal or regulatory obligation.
        </p>
      </div>
    </TosWrapper>
  )
}