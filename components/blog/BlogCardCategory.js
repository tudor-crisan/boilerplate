import Button from "@/components/button/Button";
import { defaultStyling } from "@/libs/defaults";


const BlogCardCategory = ({ category, tag = "h2" }) => {
  const TitleTag = tag;

  return (
    <Button
      className={`${defaultStyling.components.element} h-auto block font-normal duration-200 hover:bg-neutral hover:text-neutral-content`}
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
