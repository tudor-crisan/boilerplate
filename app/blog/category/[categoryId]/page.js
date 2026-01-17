
import { notFound } from "next/navigation";
import BlogCardArticle from "@/components/blog/BlogCardArticle";
import BlogCardCategory from "@/components/blog/BlogCardCategory";
import Title from "@/components/common/Title";
import Paragraph from "@/components/common/Paragraph";
import Grid from "@/components/common/Grid";
import { defaultSetting as config, defaultBlog, defaultStyling } from "@/libs/defaults";
import { getMetadata } from "@/libs/seo";
import PagesBlog from "@/components/pages/PagesBlog";

const { articles, categories } = defaultBlog;

export async function generateStaticParams() {
  return categories.map((category) => ({
    categoryId: category.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { categoryId } = await params;
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
  const { categoryId } = (await params);

  const category = categories.find((c) => c.slug === categoryId);

  if (!category) {
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
      <section className={`${defaultStyling.general.container} my-6 sm:mt-12 px-4 space-y-3`}>
        <Title className={`${defaultStyling.section.title}`}>
          {category.title}
        </Title>
        <Paragraph>
          {category.description}
        </Paragraph>
      </section>

      <section className={`${defaultStyling.general.container} px-4 mb-8`}>
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

      <section className={`${defaultStyling.general.container} space-y-3 px-4 pb-12`}>
        <Title>
          Browse other categories
        </Title>
        <Grid className="grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((category) => (
            <BlogCardCategory key={category.slug} category={category} tag="div" />
          ))}
        </Grid>
      </section>
    </PagesBlog>
  );
}
