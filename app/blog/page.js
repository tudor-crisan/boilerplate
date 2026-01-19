import BlogCategoryList from "@/components/blog/BlogCategoryList";
import BlogArticleList from "@/components/blog/BlogArticleList";
import Title from "@/components/common/Title";
import Paragraph from "@/components/common/Paragraph";
import { defaultBlog, defaultStyling } from "@/libs/defaults";
import { getMetadata } from "@/libs/seo";
import PagesBlog from "@/components/pages/PagesBlog";
import BlogSchemaCollection from "@/components/blog/BlogSchemaCollection";
import BlogDisclaimer from "@/components/blog/BlogDisclaimer";

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
    .map((article) => ({
      ...article,
      categories: article.categorySlugs.map((slug) =>
        categories.find((c) => c.slug === slug)
      ),
    }));
  return (
    <PagesBlog>
      <BlogSchemaCollection articles={articlesToDisplay} />
      <section className={`${defaultStyling.general.container} space-y-3 mt-6 mb-12 px-4`}>
        <BlogDisclaimer />
        <Title className={`${defaultStyling.section.title} mt-4`}>
          {defaultBlog.title}
        </Title>
        <Paragraph className="text-lg opacity-80 leading-relaxed">
          {defaultBlog.description}
        </Paragraph>

      </section>

      <section className={`${defaultStyling.general.container} px-4 mb-12`}>
        <Title tag="h2" className="mb-4 font-bold text-lg sm:text-xl">
          Browse articles by category
        </Title>
        <BlogCategoryList />
      </section>

      <section className={`${defaultStyling.general.container} mb-12 sm:mb-24 px-4`}>
        <BlogArticleList articles={articlesToDisplay} />
      </section>
    </PagesBlog>
  );
}
