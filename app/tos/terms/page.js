
"use client";
import useSettings from "@/hooks/useSettings";
import TosWrapper from "@/components/tos/TosWrapper";

export default function TosTerms() {
  const settings = useSettings();

  return (
    <TosWrapper>
      <h1 className="md:text-3xl text-2xl font-extrabold leading-none mb-6">Terms of Service</h1>
      <div className="space-y-4 leading-relaxed opacity-90 text-base-content">
        <p>Last updated: {settings.business.last_updated}</p>

        <h2 className="text-xl font-bold mt-6 text-base-content">1. Introduction</h2>
        <p>
          Welcome to {settings.business.website_display} (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, &quot;us&quot;). By accessing or using our website,
          you agree to be bound by these Terms of Service and all applicable laws and regulations.
        </p>

        <h2 className="text-xl font-bold mt-6 text-base-content">2. Governing Law</h2>
        <p>
          These Terms shall be governed and construed in accordance with the laws of {settings.business.country}, without regard to its conflict of law provisions.
        </p>

        <h2 className="text-xl font-bold mt-6 text-base-content">3. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at:
        </p>
        <p>
          <strong>Email:</strong> <a href={`mailto:${settings.business.email}`} className="link link-hover link-primary">{settings.business.email}</a>
        </p>
        <p>
          <strong>Address:</strong><br />
          {settings.business.entity_name}<br />
          {settings.business.address_line1}, {settings.business.address_line2}<br />
          {settings.business.country}
        </p>
      </div>
    </TosWrapper>
  )
}