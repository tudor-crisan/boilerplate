"use client";

import { useStyling } from "@/modules/general/context/ContextStyling";
import { cn } from "@/modules/general/libs/utils.client";
import Link from "next/link";

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
