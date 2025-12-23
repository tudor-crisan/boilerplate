
"use client";
import useSettings from "@/hooks/useSettings";
import TosWrapper from "@/components/tos/TosWrapper";

export default function TosSupport() {
  const settings = useSettings();

  return (
    <TosWrapper>
      <h1 className="md:text-3xl text-2xl font-extrabold leading-none mb-6">Support</h1>
      <div className="space-y-4 leading-relaxed opacity-90 text-base-content">
        <p className="text-lg">
          Need help? We are here for you. Please reach out to us using the contact details below.
        </p>

        <div className="mt-8 bg-base-200 p-8 rounded-2xl shadow-sm border border-base-300">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <span className="font-bold block text-xs opacity-70 uppercase tracking-wider mb-1">Email</span>
                  <a href={`mailto:${settings.business.email}`} className="link link-hover link-primary text-lg">
                    {settings.business.email}
                  </a>
                </div>
                {settings.business.phone && (
                  <div>
                    <span className="font-bold block text-xs opacity-70 uppercase tracking-wider mb-1">Phone</span>
                    <a href={`tel:${settings.business.phone}`} className="text-lg hover:text-primary transition-colors">
                      {settings.business.phone_display}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Business Details</h2>
              <div className="space-y-4">
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
                  <a href={settings.business.website} target="_blank" rel="noopener noreferrer" className="link link-hover link-primary">
                    {settings.business.website_display}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TosWrapper>
  )
}
