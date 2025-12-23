
"use client";

import Link from "next/link";
import Image from "next/image";
import Button from "@/components/button/Button";
import useSettings from "@/hooks/useSettings";

export default function TosPrivacy() {
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
        <h1 className="md:text-3xl text-2xl font-extrabold leading-none mb-6">Privacy Policy</h1>
        <div className="space-y-4 leading-relaxed opacity-90 text-base-content">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-xl font-bold mt-6 text-base-content">1. Introduction</h2>
          <p>
            At {business.website_display}, we respect your privacy and are committed to protecting your personal data.
            This privacy policy will inform you as to how we look after your personal data when you visit our website
            and tell you about your privacy rights and how the law protects you.
          </p>

          <h2 className="text-xl font-bold mt-6 text-base-content">2. Contact Details</h2>
          <p>
            Full name of legal entity: {business.entity_name}<br />
            Email address: <a href={`mailto:${business.email}`} className="link link-hover link-primary">{business.email}</a><br />
            Postal address: {business.address_line1}, {business.address_line2}, {business.country}
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
      </div>
    </main>
  )
}