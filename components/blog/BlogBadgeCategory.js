"use client";

import Link from "next/link";
import { useStyling } from "@/context/ContextStyling";
import { cn } from "@/libs/utils.client";

const BadgeCategory = ({ category, extraStyle }) => {
  const { styling } = useStyling();

  return (
    <Link
      href={`/blog/category/${category.slug}`}
      className={cn(styling.blog.badge, extraStyle)}
      title={`Posts in ${category.title}`}
      rel="tag"
    >
      {category.titleShort}
    </Link>
  );
};

export default BadgeCategory;
