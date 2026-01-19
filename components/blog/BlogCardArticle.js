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
          <figure className={`aspect-video ${styling.flex.center} bg-base-200 overflow-hidden`}>
            <div
              className="w-full h-full bg-primary"
              style={{
                maskImage: `url(${article.image.src})`,
                WebkitMaskImage: `url(${article.image.src})`,
                maskSize: "contain",
                maskPosition: "center",
                maskRepeat: "no-repeat",
              }}
              role="img"
              aria-label={article.image.alt}
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

          <div className={`${styling.flex.items_center} gap-3 text-sm`}>
            <div
              title={`Posts by ${config.business.name}`}
              className="flex items-start gap-3 group"
            >
              <div className="shrink-0 mt-0.5">
                <IconBusinessImage className="size-8 sm:size-7" />
              </div>
              <div className={`${styling.flex.col} gap-0.5`}>
                <span itemProp="author">
                  <TextSmall className="text-base-content font-semibold text-sm leading-none">
                    {config.business.name}
                  </TextSmall>
                </span>
                <div className={`${styling.flex.items_center} gap-1.5 text-xs opacity-60`}>
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
