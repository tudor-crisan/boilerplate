import Link from "next/link";
import CardArticle from "@/components/blog/CardArticle";
import CardCategory from "@/components/blog/CardCategory";
import { defaultSetting as config, defaultBlog } from "@/libs/defaults";
import { getMetadata } from "@/libs/seo";
import PagesBlog from "@/components/pages/PagesBlog";

const { articles, categories } = defaultBlog;

export const metadata = getMetadata("modules.blog", {
  title: `${config.appName} Blog | Learn and Grow`,
  description: `Learn how to ship your startup in days, not weeks. And get the latest updates about ${config.appName}`,
  canonicalUrlRelative: "/blog",
});

export default async function Blog() {
  const articlesToDisplay = articles
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 6)
    .map((article) => ({
      ...article,
      categories: article.categorySlugs.map((slug) =>
        categories.find((c) => c.slug === slug)
      ),
    }));
  return (
    <PagesBlog>
      <section className="text-center max-w-xl mx-auto mt-12 mb-24 md:mb-32 px-4">
        <h1 className="font-extrabold text-3xl lg:text-5xl tracking-tight mb-6">
          The {config.appName} Blog
        </h1>
        <p className="text-lg opacity-80 leading-relaxed">
          Learn how to ship your startup in days, not weeks. And get the latest
          updates about the boilerplate
        </p>
      </section>

      <section className="grid lg:grid-cols-2 mb-24 md:mb-32 gap-8 px-4 max-w-6xl mx-auto">
        {articlesToDisplay.map((article, i) => (
          <CardArticle
            article={article}
            key={article.slug}
            isImagePriority={i <= 2}
          />
        ))}
      </section>

      <section className="px-4 max-w-6xl mx-auto">
        <p className="font-bold text-2xl lg:text-4xl tracking-tight text-center mb-8 md:mb-12">
          Browse articles by category
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <CardCategory key={category.slug} category={category} tag="div" />
          ))}
        </div>
      </section>
    </PagesBlog>
  );
}
