import { defaultBlog, defaultSetting as settings } from "@/libs/defaults";
import Script from "next/script";

const BlogSchemaCollection = ({ articles }) => {
  return (
    <Script
      type="application/ld+json"
      id="json-ld-blog-home"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: defaultBlog.title,
          description: defaultBlog.description,
          url: `https://${settings.website}/blog`,
          mainEntity: {
            "@type": "ItemList",
            itemListElement: articles.map((article, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `https://${settings.website}/blog/${article.slug}`,
              name: article.title,
            })),
          },
        }),
      }}
    />
  );
};

export default BlogSchemaCollection;
