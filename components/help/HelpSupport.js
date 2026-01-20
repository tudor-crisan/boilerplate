"use client";
import Grid from "@/components/common/Grid";
import Title from "@/components/common/Title";
import { useStyling } from "@/context/ContextStyling";
import { defaultSetting as settings } from "@/libs/defaults";
import React from 'react';
import Link from "next/link";

export default function HelpSupport() {
  const { styling } = useStyling();

  return (
    <div className={`${styling.components.card} mt-8 bg-base-200 ${styling.general.box}`}>
      <Grid>
        <div>
          <Title>Contact Information</Title>
          <div className="space-y-4 mt-4">
            <div>
              <span className="font-bold block text-xs opacity-70 uppercase tracking-wider mb-1">Email&nbsp;</span>
              <Link href={`mailto:${settings.business.support_email}`} className={styling.components.link}>
                {settings.business.support_email}
              </Link>
            </div>
            {settings.business.phone && (
              <div>
                <span className="font-bold block text-xs opacity-70 uppercase tracking-wider mb-1">Phone</span>
                <Link href={`tel:${settings.business.phone}`} className={styling.components.link}>
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
              <Link href={settings.business.website} className={styling.components.link}>
                {settings.business.website_display}
              </Link>
            </div>
          </div>
        </div>
      </Grid>
    </div>
  );
}
