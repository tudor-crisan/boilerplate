"use client";
import BlogCardArticle from "@/modules/blog/components/blog/BlogCardArticle";
import Button from "@/modules/general/components/button/Button";
import Grid from "@/modules/general/components/common/Grid";
import SectionHeading from "@/modules/general/components/section/SectionHeading";
import SectionWrapper from "@/modules/general/components/section/SectionWrapper";
import { useCopywriting } from "@/modules/general/context/ContextCopywriting";
import { useStyling } from "@/modules/general/context/ContextStyling";
import { defaultBlog } from "@/modules/general/libs/defaults";
import { useEffect, useState } from "react";

export default function SectionBlog() {
  const { styling } = useStyling();
  const { copywriting } = useCopywriting();

  const blog = copywriting.SectionBlog;
  const { articles, categories } = defaultBlog;

  const [displayedArticles, setDisplayedArticles] = useState([]);

  useEffect(() => {
    // Randomize articles on the client side
    setDisplayedArticles(
      [...articles].sort(() => 0.5 - Math.random()).slice(0, 2),
    );
  }, [articles]);

  const latestArticles = displayedArticles.map((article) => ({
    ...article,
    categories: article.categorySlugs.map((slug) =>
      categories.find((c) => c.slug === slug),
    ),
  }));

  return (
    <SectionWrapper id="blog" containerClassName="space-y-12">
      <div className={`${styling.flex.col} items-center space-y-4`}>
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
    </SectionWrapper>
  );
}
