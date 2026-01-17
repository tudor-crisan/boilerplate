import { defaultSetting as settings } from "@/libs/defaults";

const getByPath = (obj = {}, path) => {
  return path
    .split(".")
    .reduce((acc, key) => acc?.[key], obj);
};

export const getMetadata = (target = "", variables = {}) => {
  const metadata = getByPath(settings?.metadata, target);

  if (settings?.appName) {
    variables.appName = settings.appName;
  }

  if (settings?.seo) {
    variables.seoTitle = variables.seoTitle || settings.seo.title;
    variables.seoDescription = variables.seoDescription || settings.seo.description;
    variables.seoTagline = variables.seoTagline || settings.seo.tagline;
    variables.seoImage = variables.seoImage || settings.seo.image;
  }

  if (!metadata) {
    return {}
  };

  let title = metadata?.title;
  let description = metadata?.description;

  Object.keys(variables).forEach((key) => {
    title = title?.replace(new RegExp(`{${key}}`, "g"), variables[key]);
    description = description?.replace(new RegExp(`{${key}}`, "g"), variables[key]);
  });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: variables.ogType || "website",
      url: `https://${settings.website}${variables.canonicalUrlRelative || ""}`,
      images: [
        {
          url: variables.seoImage || settings.seo?.image || "",
        },
      ],
      ...(variables.ogType === "article" && {
        article: {
          publishedTime: variables.publishedTime,
          authors: [variables.author || settings.appName],
          tags: variables.tags || [],
        },
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [variables.seoImage || settings.seo?.image || ""],
    },
    alternates: {
      canonical: variables.canonicalUrlRelative,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
};

export const metadata = getMetadata("modules.board");
