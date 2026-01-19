import BlogCardCategory from "@/components/blog/BlogCardCategory";
import Grid from "@/components/common/Grid";
import { defaultBlog } from "@/libs/defaults";

const { categories } = defaultBlog;

const BlogCategoryList = () => {
  return (
    <Grid className="grid-cols-2 sm:grid-cols-4 gap-4">
      {categories.map((category) => (
        <BlogCardCategory key={category.slug} category={category} tag="div" />
      ))}
    </Grid>
  );
};

export default BlogCategoryList;
