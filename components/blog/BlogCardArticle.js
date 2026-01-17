import Link from "next/link";
import Image from "next/image";
import BlogBadgeCategory from "./BlogBadgeCategory";
import ProfileImage from "@/components/common/ProfileImage";
import Title from "@/components/common/Title";
import Paragraph from "@/components/common/Paragraph";
import { defaultStyling, defaultSetting as config } from "@/libs/defaults";

const BlogCardArticle = ({ article, showCategory = true, isImagePriority = false }) => {
  return (
    <article className={`${defaultStyling.components.card} overflow-hidden`}>
      {article.image?.src && (
        <Link
          href={`/blog/${article.slug}`}
          className="link link-hover hover:link-primary"
          title={article.title}
          rel="bookmark"
        >
          <figure>
            <Image
              src={article.image.src}
              alt={article.image.alt}
              width={600}
              height={338}
              priority={isImagePriority}
              className="aspect-video object-center object-cover hover:scale-[1.03] duration-200 ease-in-out"
            />
          </figure>
        </Link>
      )}
      <div className="card-body">

        {showCategory && (
          <div className="flex flex-wrap gap-2">
            {article.categories.map((category) => (
              <BlogBadgeCategory category={category} key={category.slug} />
            ))}
          </div>
        )}

        <Title className={defaultStyling.section.title}>
          <Link
            href={`/blog/${article.slug}`}
            className={defaultStyling.components.link}
            title={article.title}
            rel="bookmark"
          >
            {article.title}
          </Link>
        </Title>

        <div className=" text-base-content/80 space-y-4">
          <Paragraph>
            {article.description}
          </Paragraph>

          <div className="flex items-center gap-4 text-sm">
            <div
              title={`Posts by ${config.business.name}`}
              className="inline-flex items-center gap-2 group"
            >
              <span itemProp="author">
                <ProfileImage
                  src={config.business.logo}
                  size="sm"
                  className="w-7 h-7 rounded-full object-cover object-center"
                />
              </span>
              <span className="group-hover:underline">{config.business.name}</span>
            </div>

            <span itemProp="datePublished">
              {new Date(article.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCardArticle;
