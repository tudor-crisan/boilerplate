"use client";
import Paragraph from "@/components/common/Paragraph";
import Title from "@/components/common/Title";
import HelpContactSupport from "@/components/help/HelpContactSupport";
import TosContent from "@/components/tos/TosContent";
import TosWrapper from "@/components/tos/TosWrapper";
import { defaultHelp } from "@/libs/defaults";
import React from "react";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";

export default function HelpArticlePage() {
  const params = useParams();
  const articleId = params.articleId;

  const article = defaultHelp?.articles?.find((a) => a.id === articleId);

  if (!article) {
    return notFound();
  }

  return (
    <TosWrapper>
      <TosContent>
        <div className="space-y-1 mt-4">
          <Title>{article.title}</Title>
          <Paragraph>{article.description}</Paragraph>
        </div>

        <div className="space-y-6">
          {article.content?.map((block, index) => {
            if (block.type === "paragraph") {
              return (
                <Paragraph key={index}>
                  <span dangerouslySetInnerHTML={{ __html: block.text }} />
                </Paragraph>
              );
            }
            if (block.type === "heading") {
              return (
                <Title
                  key={index}
                  tag="h3"
                  className="mt-6 mb-2 text-xl font-bold"
                >
                  {block.text}
                </Title>
              );
            }
            if (block.type === "list") {
              return (
                <ul
                  key={index}
                  className="list-disc list-outside ml-6 space-y-2 mb-4"
                >
                  {block.items.map((item, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </ul>
              );
            }
            if (block.type === "image") {
              return (
                <div
                  key={index}
                  className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden my-6"
                >
                  <Image
                    src={block.src}
                    alt={block.alt || article.title}
                    fill
                    className="object-cover"
                  />
                </div>
              );
            }
            return null;
          })}
        </div>

        <HelpContactSupport />
      </TosContent>
    </TosWrapper>
  );
}
