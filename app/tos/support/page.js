
"use client";

import Link from "next/link";
import Image from "next/image";
import Button from "@/components/button/Button";
import useSettings from "@/hooks/useSettings";

export default function TosSupport() {
  const settings = useSettings();
  const { business } = settings;

  return (
    <main className="min-h-screen bg-base-100 text-base-content">
      {/* Header */}
      <div className="bg-base-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            {business.logo && (
              <Image
                src={business.logo}
                alt={business.name}
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
            )}
            <span className="font-bold text-lg">{business.website_display}</span>
          </Link>
          <Button href="/" variant="btn-ghost" size="btn-sm">
            Back to Home
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-8">
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
                    <a href={`mailto:${business.email}`} className="link link-hover link-primary text-lg">
                      {business.email}
                    </a>
                  </div>
                  {business.phone && (
                    <div>
                      <span className="font-bold block text-xs opacity-70 uppercase tracking-wider mb-1">Phone</span>
                      <a href={`tel:${business.phone}`} className="text-lg hover:text-primary transition-colors">
                        {business.phone_display}
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
                    <p className="text-lg">{business.entity_name}</p>
                  </div>
                  <div>
                    <span className="font-bold block text-xs opacity-70 uppercase tracking-wider mb-1">Address</span>
                    <p>
                      {business.address_line1}<br />
                      {business.address_line2}<br />
                      {business.country}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold block text-xs opacity-70 uppercase tracking-wider mb-1">Main Website</span>
                    <a href={business.website} target="_blank" rel="noopener noreferrer" className="link link-hover link-primary">
                      {business.website_display}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
