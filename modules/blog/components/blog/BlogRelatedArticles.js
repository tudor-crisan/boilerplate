import Grid from "@/components/common/Grid";
import Title from "@/components/common/Title";
import BlogCardArticle from "@/modules/blog/components/blog/BlogCardArticle";

const BlogRelatedArticles = ({ articles }) => {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="mt-12 mb-6">
      <Title tag="h2" className="mb-4">
        Related Articles
      </Title>
      <Grid>
        {articles.map((relatedArticle) => (
          <BlogCardArticle
            key={relatedArticle.slug}
            article={relatedArticle}
            showCategory={false}
          />
        ))}
      </Grid>
    </section>
  );
};

export default BlogRelatedArticles;
