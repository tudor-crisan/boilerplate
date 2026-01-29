import BlogCardArticle from "@/modules/blog/components/blog/BlogCardArticle";
import Grid from "@/modules/general/components/common/Grid";

const BlogArticleList = ({ articles }) => {
  if (!articles || articles.length === 0) return null;

  return (
    <Grid>
      {articles.map((article, i) => (
        <BlogCardArticle
          article={article}
          key={article.slug}
          isImagePriority={i <= 2}
        />
      ))}
    </Grid>
  );
};

export default BlogArticleList;
