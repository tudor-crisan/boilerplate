"use client";
import Button from "@/components/button/Button";

const BlogCardCategory = ({ category }) => {
  return (
    <Button
      className="capitalize"
      href={`/blog/category/${category.slug}`}
      title={category.title}
      rel="tag"
      variant="btn-neutral"
      size="btn-sm"
    >
      {category?.titleShort || category.title}
    </Button>
  );
};

export default BlogCardCategory;
