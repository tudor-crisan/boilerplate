"use client";
import Button from "@/components/button/Button";
import Grid from "@/components/common/Grid";
import Paragraph from "@/components/common/Paragraph";
import Title from "@/components/common/Title";
import Input from "@/components/input/Input";
import SvgSearch from "@/components/svg/SvgSearch";
import TosContent from "@/components/tos/TosContent";
import { useStyling } from "@/context/ContextStyling";
import { defaultHelp,defaultSetting as settings } from "@/libs/defaults";
import React, { useState } from "react";
import Link from "next/link";

// Helper component for Article Card
const ArticleCard = ({ id, title, description }) => {
  const { styling } = useStyling();
  return (
    <Link href={`${settings.paths.help.source}/${id}`} className={`${styling.components.card} bg-base-200 ${styling.general.box} hover:bg-base-300 transition-colors flex flex-col items-center text-center cursor-pointer h-full`}>
      <Title tag="h3" className="mb-2 text-lg">{title}</Title>
      <Paragraph className="text-sm border-none!">{description}</Paragraph>
    </Link>
  );
};

export default function HelpArticles() {
  const { styling } = useStyling();
  const [searchQuery, setSearchQuery] = useState("");

  const articles = defaultHelp.articles || [];

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className={`${styling.flex.col_center} w-full gap-4 pt-12`}>
        <Title className={styling.section.title}>Help Articles</Title>

        <div className="w-full sm:w-1/2 mx-auto">
          <Input
            placeholder="Search the knowledge base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<SvgSearch />}
            allowClear={true}
          />
        </div>
      </div>

      <TosContent>
        {/* Articles Grid */}
        {filteredArticles.length ? (
          <Grid className="my-12">
            {filteredArticles.map((article, index) => (
              <div key={index}>
                <ArticleCard {...article} />
              </div>
            ))}
          </Grid>
        ) : null}

        {filteredArticles.length === 0 && (
          <div className={`${styling.flex.center} gap-1 opacity-70 mt-12`}>
            <SvgSearch className="opacity-50" size="size-8" />
            <Paragraph>No articles found matching &quot;{searchQuery}&quot;</Paragraph>
          </div>
        )}

        {/* Contact Support Link */}
        <div className={`${styling.flex.col_center} space-y-3 mb-10`}>
          <Paragraph className={styling.section.paragraph}>Can&apos;t find what you&apos;re looking for?</Paragraph>
          <Button href={settings.paths.support.source} variant="btn-outline">
            Contact Support
          </Button>
        </div>
      </TosContent>
    </>
  );
}
