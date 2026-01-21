"use client";

import Button from "@/components/button/Button";
import Paragraph from "@/components/common/Paragraph";
import { useEffect, useState } from "react";

// List of EU/EEA countries + UK
const EU_COUNTRIES = [
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
  "GB",
  "IS",
  "LI",
  "NO",
];

export default function GdprPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkConsent = async () => {
      // 1. Check local storage
      const hasConsent = localStorage.getItem("gdpr-consent");
      if (hasConsent === "true") {
        return;
      }

      // 3. Skip if on localhost
      if (process.env.NODE_ENV === "development") return;

      try {
        // 2. Check IP location
        const response = await fetch("https://ipapi.co/json/");
        if (!response.ok) {
          // Fallback: If we can't determine country, maybe be safe and show it?
          // Or default to hidden to avoid annoyance?
          // Let's default to hidden to avoid blocking users if the API fails,
          // or we could show it to everyone if API fails.
          // Unsolicited popups are annoying. Let's start with showing only if confirmed EU.
          return;
        }
        const data = await response.json();

        if (data.country_code && EU_COUNTRIES.includes(data.country_code)) {
          setIsVisible(true);
        }
      } catch (error) {
        console.error("Failed to check GDPR requirements:", error);
      }
    };

    checkConsent();
  }, []);

  const handleAccept = () => {
    localStorage.setItem("gdpr-consent", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-base-100 border-t border-base-300 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-center sm:text-left text-sm text-base-content/80">
        <Paragraph>
          We use cookies to improve your experience and analyze our traffic. By
          clicking &ldquo;Accept&ldquo;, you consent to our use of cookies.
        </Paragraph>
      </div>
      <div className="flex gap-2 shrink-0">
        <Button className="btn-primary btn-sm" onClick={handleAccept}>
          Accept
        </Button>
      </div>
    </div>
  );
}
