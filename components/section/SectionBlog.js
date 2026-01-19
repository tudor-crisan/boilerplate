"use client";
import { useStyling } from "@/context/ContextStyling";
import { useCopywriting } from "@/context/ContextCopywriting";
import { defaultBlog } from "@/libs/defaults";
import BlogCardArticle from "@/components/blog/BlogCardArticle";
import Grid from "@/components/common/Grid";
import Button from "@/components/button/Button";
import SectionHeading from "@/components/section/SectionHeading";
import { cn } from "@/libs/utils.client";

export default function SectionBlog() {
  const { styling } = useStyling();
  const { copywriting } = useCopywriting();

  const blog = copywriting.SectionBlog;
  const { articles, categories } = defaultBlog;

  // Sort by date and take the first 3 (actually 2 as per original code)
  const latestArticles = articles
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 2)
    .map((article) => ({
      ...article,
      categories: article.categorySlugs.map((slug) =>
        categories.find((c) => c.slug === slug)
      ),
    }));

  return (
    <section id="blog" className={cn(`${styling.general.container} ${styling.general.box} bg-base-100 mb-10`, styling.SectionBlog?.padding)}>
      <div className="space-y-12">
        <div className="flex flex-col items-center space-y-4">
          <SectionHeading
            headline={blog.headline}
            paragraph={blog.paragraph}
            headlineClassName={styling.section.title}
            paragraphClassName="max-w-xl mx-auto opacity-80"
            align="center"
          />

          <div className="flex justify-center mb-6">
            <Button href="/blog" className="btn-primary">
              {blog.button.label}
            </Button>
          </div>
        </div>
        <Grid>
          {latestArticles.map((article) => (
            <BlogCardArticle
              article={article}
              key={article.slug}
              showCategory={true}
            />
          ))}
        </Grid>
      </div>
    </section>
  );
}
