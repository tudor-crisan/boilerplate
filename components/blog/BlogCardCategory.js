"use client";

import Button from "@/components/button/Button";
import { useStyling } from "@/context/ContextStyling";


const BlogCardCategory = ({ category, tag = "h2" }) => {
  const { styling } = useStyling();
  const TitleTag = tag;

  return (
    <Button
      className={`${styling.components.element}`}
      href={`/blog/category/${category.slug}`}
      title={category.title}
      rel="tag"
      variant=""
      size=""
    >
      <TitleTag className="sm:text-lg font-medium">
        {category?.titleShort || category.title}
      </TitleTag>
    </Button>
  );
};

export default BlogCardCategory;
