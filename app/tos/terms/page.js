
"use client";

import Link from "next/link";
import Image from "next/image";
import Button from "@/components/button/Button";
import useSettings from "@/hooks/useSettings";

export default function TosTerms() {
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
        <h1 className="md:text-3xl text-2xl font-extrabold leading-none mb-6">Terms of Service</h1>
        <div className="space-y-4 leading-relaxed opacity-90 text-base-content">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-xl font-bold mt-6 text-base-content">1. Introduction</h2>
          <p>
            Welcome to {business.website_display} ("Company", "we", "our", "us"). By accessing or using our website,
            you agree to be bound by these Terms of Service and all applicable laws and regulations.
          </p>

          <h2 className="text-xl font-bold mt-6 text-base-content">2. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of {business.country}, without regard to its conflict of law provisions.
          </p>

          <h2 className="text-xl font-bold mt-6 text-base-content">3. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <p>
            <strong>Email:</strong> <a href={`mailto:${business.email}`} className="link link-hover link-primary">{business.email}</a>
          </p>
          <p>
            <strong>Address:</strong><br />
            {business.entity_name}<br />
            {business.address_line1}, {business.address_line2}<br />
            {business.country}
          </p>
        </div>
      </div>
    </main>
  )
}