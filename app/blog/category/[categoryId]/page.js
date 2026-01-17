
import { notFound } from "next/navigation";
import BlogCardArticle from "@/components/blog/BlogCardArticle";
import BlogCardCategory from "@/components/blog/BlogCardCategory";
import Title from "@/components/common/Title";
import Paragraph from "@/components/common/Paragraph";
import Grid from "@/components/common/Grid";
import { defaultSetting as config, defaultBlog } from "@/libs/defaults";
import { getMetadata } from "@/libs/seo";
import PagesBlog from "@/components/pages/PagesBlog";

const { articles, categories } = defaultBlog;

export async function generateStaticParams() {
  return categories.map((category) => ({
    categoryId: category.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { categoryId } = params;
  const category = categories.find((c) => c.slug === categoryId);

  if (!category) {
    return {};
  }

  return getMetadata("modules.blog", {
    title: `${category.title} | ${config.appName} Blog`,
    description: category.description,
    canonicalUrlRelative: `/blog/category/${categoryId}`,
  });
}

export default async function BlogCategory({ params }) {
  const { categoryId } = params;

  console.log("DEBUG: BlogCategory params:", params);
  console.log("DEBUG: categoryId:", categoryId);
  console.log("DEBUG: Available categories:", categories.map(c => c.slug));

  const category = categories.find((c) => c.slug === categoryId);

  if (!category) {
    console.log("DEBUG: Category not found for slug:", categoryId);
    return notFound();
  }

  const articlesToDisplay = articles
    .filter((article) => article.categorySlugs.includes(categoryId))
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .map((article) => ({
      ...article,
      categories: article.categorySlugs.map((slug) =>
        categories.find((c) => c.slug === slug)
      ),
    }));

  return (
    <PagesBlog>
      <section className="text-center max-w-xl mx-auto mt-12 mb-24 sm:mb-32 px-4">
        <Title className={`mb-6 ${defaultStyling.section.title}`}>
          {category.title}
        </Title>
        <Paragraph className="text-lg opacity-80 leading-relaxed">
          {category.description}
        </Paragraph>
      </section>

      <section className="mb-24 sm:mb-32 px-4 max-w-6xl mx-auto">
        <Grid>
          {articlesToDisplay.map((article, i) => (
            <BlogCardArticle
              article={article}
              key={article.slug}
              isImagePriority={i <= 2}
            />
          ))}
        </Grid>
      </section>

      <section className="px-4 max-w-6xl mx-auto">
        <p className="font-bold text-2xl sm:text-4xl tracking-tight text-center mb-8 sm:mb-12">
          Browse other categories
        </p>

        <Grid className="gap-4">
          {categories.map((category) => (
            <BlogCardCategory key={category.slug} category={category} tag="div" />
          ))}
        </Grid>
      </section>
    </PagesBlog>
  );
}
