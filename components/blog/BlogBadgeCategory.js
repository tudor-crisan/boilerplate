import Link from "next/link";


const BadgeCategory = ({ category, extraStyle }) => {
  return (
    <Link
      href={`/blog/category/${category.slug}`}
      className={`badge badge-sm sm:badge-md hover:badge-primary ${extraStyle ? extraStyle : ""}`}
      title={`Posts in ${category.title}`}
      rel="tag"
    >
      {category.titleShort}
    </Link>
  );
};

export default BadgeCategory;
