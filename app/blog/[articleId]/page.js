import BlogBadgeCategory from "@/components/blog/BlogBadgeCategory";
import BlogDisclaimer from "@/components/blog/BlogDisclaimer";
import BlogRelatedArticles from "@/components/blog/BlogRelatedArticles";
import BlogSchemaArticle from "@/components/blog/BlogSchemaArticle";
import ButtonBack from "@/components/button/ButtonBack";
import Paragraph from "@/components/common/Paragraph";
import Title from "@/components/common/Title";
import PagesBlog from "@/components/pages/PagesBlog";
import {
  defaultBlog,
  defaultSetting as settings,
  defaultStyling,
} from "@/libs/defaults";
import { getMetadata } from "@/libs/seo";
import { notFound } from "next/navigation";

const { articles, categories } = defaultBlog;

export async function generateMetadata({ params }) {
  const { articleId } = await params;
  const article = articles.find((article) => article.slug === articleId);

  if (!article) return {};

  return getMetadata("modules.blog.article", {
    title: article.title,
    description: article.description,
    seoImage: article.image.urlRelative,
    canonicalUrlRelative: `/blog/${article.slug}`,
    ogType: "article",
    publishedTime: article.publishedAt,
    author: settings.business?.name || settings.appName,
    tags: article.categorySlugs
      .map((slug) => categories.find((c) => c.slug === slug)?.title)
      .filter(Boolean),
  });
}

export default async function Article({ params }) {
  const { articleId } = await params;
  const articleRaw = articles.find((article) => article.slug === articleId);

  if (!articleRaw) {
    console.log("Article NOT FOUND for slug:", articleId);
    console.log(
      "Available slugs:",
      articles.map((a) => a.slug),
    );
    return notFound();
  }

  const article = {
    ...articleRaw,
    categories: articleRaw.categorySlugs.map((slug) =>
      categories.find((c) => c.slug === slug),
    ),
  };

  const articlesRelated = articles
    .filter(
      (a) =>
        a.slug !== articleId &&
        a.categorySlugs.some((c) => articleRaw.categorySlugs.includes(c)),
    )
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 3)
    .map((a) => ({
      ...a,
      categories: a.categorySlugs.map((slug) =>
        categories.find((c) => c.slug === slug),
      ),
    }));

  return (
    <PagesBlog>
      <BlogSchemaArticle article={article} />

      <article
        className={`${defaultStyling.general.container} ${defaultStyling.components.header} pt-4 sm:pt-12 pb-8`}
      >
        <BlogDisclaimer />
        <div className="mt-6 mb-4 sm:mb-6">
          <Title className={`${defaultStyling.section.title} mb-4`}>
            {article.title}
          </Title>
          <Paragraph className="text-base-content/80 sm:text-lg">
            {article.description}
          </Paragraph>

          <div className={`${defaultStyling.flex.between} gap-4 mt-4`}>
            <div className="flex items-center gap-4">
              {article.categories.map((category) => (
                <BlogBadgeCategory category={category} key={category.slug} />
              ))}
              <span className="text-base-content/80" itemProp="datePublished">
                {new Date(article.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
        <section className="w-full mt-4 border-t-2 pt-6 border-gray-200">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </section>
        <div className="flex justify-start items-start mt-8">
          <ButtonBack url="/blog" />
        </div>

        <BlogRelatedArticles articles={articlesRelated} />
      </article>
    </PagesBlog>
  );
}
