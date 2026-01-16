import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import BadgeCategory from "@/components/blog/BadgeCategory";
import Avatar from "@/components/blog/Avatar";
import { defaultSetting as config, defaultBlog } from "@/libs/defaults";
import { getMetadata } from "@/libs/seo";
import PagesBlog from "@/components/pages/PagesBlog";
import ButtonBack from "@/components/button/ButtonBack";

const { articles, categories } = defaultBlog;

export async function generateMetadata({ params }) {
  const { articleId } = await params;
  const article = articles.find((article) => article.slug === articleId);

  // Fallback if not found (though page component handles rendering, metadata needs it too)
  if (!article) return {};

  return getMetadata("modules.blog.article", {
    title: article.title,
    description: article.description,
    canonicalUrlRelative: `/blog/${article.slug}`,
    // Note: getMetadata in target might not support all these structure-specific overrides 
    // without modification to libs/seo.js but we pass them as variables if the template uses them.
    // However, for full custom metadata (og tags), we might need to conform to what getMetadata returns
    // OR just return the object directly here merged with defaults.
    // Given the target libs/seo.js, it looks like it merges defaults.
    // We can try to manually construct a metadata object if getMetadata is too rigid.

    // For now, using getMetadata and we might need to enhance libs/seo.js to support image overrides via variables
    // or just return standard Next.js metadata object here if getMetadata isn't flexible enough.
  });
}

export default async function Article({ params }) {
  const { articleId } = await params;
  const articleRaw = articles.find((article) => article.slug === articleId);

  if (!articleRaw) {
    console.log("Article NOT FOUND for slug:", articleId);
    console.log("Available slugs:", articles.map(a => a.slug));
    return notFound();
  }

  const article = {
    ...articleRaw,
    categories: articleRaw.categorySlugs.map((slug) =>
      categories.find((c) => c.slug === slug)
    ),
  };

  const articlesRelated = articles
    .filter(
      (a) =>
        a.slug !== articleId &&
        a.categorySlugs.some((c) =>
          articleRaw.categorySlugs.includes(c)
        )
    )
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 3)
    .map((a) => ({
      ...a,
      categories: a.categorySlugs.map((slug) =>
        categories.find((c) => c.slug === slug)
      ),
    }));

  return (
    <PagesBlog>
      {/* SCHEMA JSON-LD MARKUP FOR GOOGLE */}
      <Script
        type="application/ld+json"
        id={`json-ld-article-${article.slug}`}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://${config.domainName}/blog/${article.slug}`,
            },
            name: article.title,
            headline: article.title,
            description: article.description,
            image: `https://${config.domainName}${article.image.urlRelative}`,
            datePublished: article.publishedAt,
            dateModified: article.publishedAt,
            author: {
              "@type": "Person",
              name: config.business.name,
            },
          }),
        }}
      />

      {/* GO BACK LINK */}
      <div>
        <ButtonBack url="/blog" />
      </div>

      <article>
        {/* HEADER WITH CATEGORIES AND DATE AND TITLE */}
        <section className="my-12 md:my-20 max-w-200">
          <div className="flex items-center gap-4 mb-6">
            {article.categories.map((category) => (
              <BadgeCategory
                category={category}
                key={category.slug}
                extraStyle="!badge-lg"
              />
            ))}
            <span className="text-base-content/80" itemProp="datePublished">
              {new Date(article.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 md:mb-8">
            {article.title}
          </h1>

          <p className="text-base-content/80 md:text-lg max-w-[700px]">
            {article.description}
          </p>
        </section>

        <div className="flex flex-col md:flex-row">
          {/* SIDEBAR WITH AUTHORS AND 3 RELATED ARTICLES */}
          <section className="max-md:pb-4 md:pl-12 max-md:border-b md:border-l md:order-last md:w-72 shrink-0 border-base-content/10">
            <p className="text-base-content/80 text-sm mb-2 md:mb-3">
              Posted by
            </p>
            <Avatar />

            {articlesRelated.length > 0 && (
              <div className="hidden md:block mt-12">
                <p className=" text-base-content/80 text-sm  mb-2 md:mb-3">
                  Related reading
                </p>
                <div className="space-y-2 md:space-y-5">
                  {articlesRelated.map((article) => (
                    <div className="" key={article.slug}>
                      <p className="mb-0.5">
                        <Link
                          href={`/blog/${article.slug}`}
                          className="link link-hover hover:link-primary font-medium"
                          title={article.title}
                          rel="bookmark"
                        >
                          {article.title}
                        </Link>
                      </p>
                      <p className="text-base-content/80 max-w-full text-sm">
                        {article.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* ARTICLE CONTENT */}
          <section className="w-full max-md:pt-4 md:pr-20 space-y-12 md:space-y-20">
            {article.content}
          </section>
        </div>
      </article>
    </PagesBlog>
  );
}
