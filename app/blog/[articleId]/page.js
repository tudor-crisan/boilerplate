import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import BlogBadgeCategory from "@/components/blog/BlogBadgeCategory";
import { defaultSetting as settings, defaultBlog } from "@/libs/defaults";
import { getMetadata } from "@/libs/seo";
import PagesBlog from "@/components/pages/PagesBlog";
import ButtonBack from "@/components/button/ButtonBack";
import Title from "@/components/common/Title";
import Paragraph from "@/components/common/Paragraph";

const { articles, categories } = defaultBlog;

export async function generateMetadata({ params }) {
  const { articleId } = await params;
  const article = articles.find((article) => article.slug === articleId);


  if (!article) return {};

  return getMetadata("modules.blog.article", {
    title: article.title,
    description: article.description,
    seoImage: article.image.urlRelative,
    canonicalUrlRelative: `/blog/${article.slug}`
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

      <Script
        type="application/ld+json"
        id={`json-ld-article-${article.slug}`}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
          }),
        }}
      />

      <article>

        <section className="my-12 sm:my-20 max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            {article.categories.map((category) => (
              <BlogBadgeCategory
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

          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8">
            <Title className={defaultStyling.section.title}>
              {article.title}
            </Title>
            <ButtonBack url="/blog" />
          </div>

          <Paragraph className="text-base-content/80 sm:text-lg max-w-[700px]">
            {article.description}
          </Paragraph>
        </section>

        <div className="flex flex-col sm:flex-row max-w-5xl mx-auto px-6">

          <section className="max-sm:pb-4 sm:pl-12 max-sm:border-b sm:border-l sm:order-last sm:w-72 shrink-0 border-base-content/10">

            {articlesRelated.length > 0 && (
              <div className="hidden sm:block mt-12">
                <Paragraph className=" text-base-content/80 text-sm  mb-2 sm:mb-3">
                  Related reading
                </Paragraph>
                <div className="space-y-2 sm:space-y-5">
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
                      <Paragraph className="text-base-content/80 max-w-full text-sm">
                        {article.description}
                      </Paragraph>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>


          <section className="w-full max-sm:pt-4 sm:pr-20 space-y-12 sm:space-y-20">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </section>
        </div>
      </article>
    </PagesBlog>
  );
}
