import BlogCardArticle from "@/components/blog/BlogCardArticle";
import BlogCardCategory from "@/components/blog/BlogCardCategory";
import Title from "@/components/common/Title";
import Paragraph from "@/components/common/Paragraph";
import { defaultBlog, defaultStyling } from "@/libs/defaults";
import { getMetadata } from "@/libs/seo";
import PagesBlog from "@/components/pages/PagesBlog";
import Grid from "@/components/common/Grid";

const { articles, categories } = defaultBlog;

export const metadata = getMetadata("modules.blog", {
  title: defaultBlog.title,
  description: defaultBlog.description,
  seoImage: defaultBlog.image,
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
      <section className={`${defaultStyling.general.container} mt-12 mb-12 px-4`}>
        <Title className={`mb-6 ${defaultStyling.section.title}`}>
          {defaultBlog.title}
        </Title>
        <Paragraph className="text-lg opacity-80 leading-relaxed">
          {defaultBlog.description}
        </Paragraph>
      </section>

      <section className={`${defaultStyling.general.container} px-4 mb-12`}>
        <Title className="mb-4 sm:mb-6 font-bold text-lg sm:text-xl">
          Browse articles by category
        </Title>

        <Grid className="grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((category) => (
            <BlogCardCategory key={category.slug} category={category} tag="div" />
          ))}
        </Grid>
      </section>

      <section className={`${defaultStyling.general.container} grid sm:grid-cols-2 mb-12 sm:mb-24 gap-8 px-4`}>
        {articlesToDisplay.map((article, i) => (
          <BlogCardArticle
            article={article}
            key={article.slug}
            isImagePriority={i <= 2}
          />
        ))}
      </section>
    </PagesBlog>
  );
}
