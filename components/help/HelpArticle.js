"use client";
import React from "react";
import TosWrapper from "@/components/tos/TosWrapper";
import TosContent from "@/components/tos/TosContent";
import Title from "@/components/common/Title";
import Paragraph from "@/components/common/Paragraph";
import ButtonBack from "@/components/button/ButtonBack";

import { defaultHelp, defaultSetting as settings } from "@/libs/defaults";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";

export default function HelpArticlePage() {
  const params = useParams();
  const articleId = params.articleId;

  const article = defaultHelp?.articles?.find(a => a.id === articleId);

  if (!article) {
    return notFound();
  }

  return (
    <TosWrapper>
      <TosContent>
        <div className="mb-8">
          <Title className="text-3xl sm:text-4xl font-extrabold mb-4">{article.title}</Title>
          <Paragraph className="text-lg opacity-70">{article.description}</Paragraph>
        </div>

        <div className="space-y-6">
          {article.content?.map((block, index) => {
            if (block.type === 'paragraph') {
              return <Paragraph key={index}>{block.text}</Paragraph>;
            }
            if (block.type === 'image') {
              return (
                <div key={index} className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden my-6">
                  <Image
                    src={block.src}
                    alt={block.alt || article.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )
            }
            return null;
          })}
        </div>
      </TosContent>
    </TosWrapper>
  );
}
