"use client";
import React, { useState } from "react";
import Title from "@/components/common/Title";
import Paragraph from "@/components/common/Paragraph";
import Input from "@/components/input/Input";
import Button from "@/components/button/Button";
import { useStyling } from "@/context/ContextStyling";
import SvgSearch from "@/components/svg/SvgSearch";
import TosContent from "@/components/tos/TosContent";
import Grid from "@/components/common/Grid";
import { defaultSetting as settings, defaultHelp } from "@/libs/defaults";
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
      <div className={`${styling.flex.col_center} space-y-3 w-full`}>
        <Title>Help Articles</Title>

        <Input
          placeholder="Search the knowledge base"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<SvgSearch />}
          allowClear={true}
        />
      </div>

      <TosContent className="space-y-6 mt-12">
        {/* Articles Grid */}
        <Grid>
          {filteredArticles.map((article, index) => (
            <div key={index}>
              <ArticleCard {...article} />
            </div>
          ))}
        </Grid>

        {filteredArticles.length === 0 && (
          <div className={`${styling.flex.col_center} opacity-70 space-y-3`}>
            <SvgSearch className="opacity-50" size="size-12" />
            <Paragraph>No articles found matching &quot;{searchQuery}&quot;</Paragraph>
          </div>
        )}

        {/* Contact Support Link */}
        <div className="text-center space-y-3 my-10">
          <Paragraph>Can&apos;t find what you&apos;re looking for?</Paragraph>
          <Button href={settings.paths.support.source} variant="btn-outline">
            Contact Support
          </Button>
        </div>
      </TosContent>
    </>
  );
}
