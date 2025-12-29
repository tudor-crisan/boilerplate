function deepMerge(target, source) {
  const isObject = (obj) => obj && typeof obj === 'object';

  if (!isObject(target) || !isObject(source)) {
    return source;
  }

  const output = { ...target };

  Object.keys(source).forEach((key) => {
    const targetValue = output[key];
    const sourceValue = source[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      output[key] = sourceValue;
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      output[key] = deepMerge(targetValue, sourceValue);
    } else {
      output[key] = sourceValue;
    }
  });

  return output;
}

const copywriting0 = {
  "SectionHeader": {
    "menus": [
      {
        "label": "Pricing",
        "path": "#pricing"
      },
      {
        "label": "FAQ",
        "path": "#faq"
      }
    ]
  },
  "SectionFooter": {
    "brand": {
      "rights": "All rights reserved."
    },
    "menus": [
      {
        "title": "Legal",
        "links": [
          {
            "label": "Terms of Service",
            "href": "/tos/terms"
          },
          {
            "label": "Privacy Policy",
            "href": "/tos/privacy"
          }
        ]
      },
      {
        "title": "Support",
        "links": [
          {
            "label": "Contact Support",
            "href": "/tos/support"
          }
        ]
      }
    ],
    "socials": {
      "label": "Socials"
    }
  }
};

const lb0_copywriting = {
  "SectionHeader": {
    "appName": "LoyalBoards"
  },
  "SectionHero": {
    "headline": "Collect customer feedback to build better products",
    "paragraph": "Create a feedback board in minutes, prioritize features, and build products your customers will love."
  },
  "SectionPricing": {
    "label": "Pricing",
    "headline": "A pricing that adapts to your needs",
    "price": "$19",
    "period": "/month",
    "features": [
      "Unlimited feedback boards",
      "Unlimited users",
      "Stripe integration",
      "Priority support"
    ]
  },
  "SectionFAQ": {
    "label": "FAQ",
    "headline": "Frequently Asked Questions",
    "questions": [
      {
        "question": "How does the Stripe integration work?",
        "answer": "LoyalBoards connects to your Stripe account to identify your loyal customers based on their subscription history. This allows you to filter and prioritize feedback from those who are most invested in your product."
      },
      {
        "question": "Can I customize the feedback board?",
        "answer": "Yes, you can customize the appearance and settings of your feedback board to match your brand and meet your specific needs."
      },
      {
        "question": "Is there a free trial available?",
        "answer": "Yes, we offer a 14-day free trial so you can explore all the features of LoyalBoards before committing to a subscription."
      }
    ]
  }
};

const merged = deepMerge(copywriting0, lb0_copywriting);

console.log(JSON.stringify(merged, null, 2));

if (merged.SectionHeader.appName === "LoyalBoards" &&
  merged.SectionHeader.menus &&
  merged.SectionHeader.menus.length > 0 &&
  merged.SectionFooter.brand &&
  merged.SectionHero) {
  console.log("LOGIC VERIFICATION PASSED");
} else {
  console.log("LOGIC VERIFICATION FAILED");
  process.exit(1);
}
