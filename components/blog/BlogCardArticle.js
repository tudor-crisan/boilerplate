"use client";

import Link from "next/link";
import Image from "next/image";
import BlogBadgeCategory from "./BlogBadgeCategory";
import Title from "@/components/common/Title";
import Paragraph from "@/components/common/Paragraph";
import { defaultSetting as config } from "@/libs/defaults";
import TextSmall from "@/components/common/TextSmall";
import IconBusinessImage from "@/components/icon/IconBusinessImage";
import { useStyling } from "@/context/ContextStyling";

const BlogCardArticle = ({ article, showCategory = true, isImagePriority = false }) => {
  const { styling } = useStyling();

  return (
    <article className={styling.blog.card}>
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
              className={styling.blog.image}
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

        <Title tag="h2">
          <Link
            href={`/blog/${article.slug}`}
            className={styling.components.link}
            title={article.title}
            rel="bookmark"
          >
            {article.title}
          </Link>
        </Title>

        <div className="space-y-4">
          <Paragraph>
            {article.description}
          </Paragraph>

          <div className="flex items-center gap-3 text-sm">
            <div
              title={`Posts by ${config.business.name}`}
              className="flex items-start gap-3 group"
            >
              <div className="flex-shrink-0 mt-0.5">
                <IconBusinessImage className="size-8 sm:size-7" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span itemProp="author">
                  <TextSmall className="text-base-content font-semibold text-sm leading-none">
                    {config.business.name}
                  </TextSmall>
                </span>
                <div className="flex items-center gap-1.5 text-xs opacity-60">
                  <span itemProp="datePublished">
                    {new Date(article.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  {article.content && (
                    <>
                      <span>•</span>
                      <span>
                        {Math.ceil(article.content.split(/\s+/).length / 200)} min read
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCardArticle;
