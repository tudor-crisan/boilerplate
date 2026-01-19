import Script from "next/script";
import { defaultSetting as settings } from "@/libs/defaults";

const BlogSchemaArticle = ({ article }) => {
  return (
    <Script
      type="application/ld+json"
      id={`json-ld-article-${article.slug}`}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "Article",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://${settings.website}/blog/${article.slug}`,
            },
            name: article.title,
            headline: article.title,
            description: article.description,
            image: `https://${settings.website}${article.image.urlRelative}`,
            datePublished: article.publishedAt,
            dateModified: article.publishedAt,
            author: {
              "@type": "Person",
              name: settings.appName,
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: `https://${settings.website}`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: `https://${settings.website}/blog`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: article.title,
                item: `https://${settings.website}/blog/${article.slug}`,
              },
            ],
          },
        ]),
      }}
    />
  );
};

export default BlogSchemaArticle;
