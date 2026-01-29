"use client";
import Grid from "@/modules/general/components/common/Grid";
import Paragraph from "@/modules/general/components/common/Paragraph";
import Title from "@/modules/general/components/common/Title";
import Input from "@/modules/general/components/input/Input";
import SvgSearch from "@/modules/general/components/svg/SvgSearch";
import TosContent from "@/modules/general/components/tos/TosContent";
import { useStyling } from "@/modules/general/context/ContextStyling";
import useHighlight from "@/modules/general/hooks/useHighlight";
import {
  defaultHelp,
  defaultSetting as settings,
} from "@/modules/general/libs/defaults";
import HelpContactSupport from "@/modules/help/components/help/HelpContactSupport";
import React, { useState } from "react";
import Link from "next/link";

export default function HelpArticles() {
  const { styling } = useStyling();
  const { HighlightedText, escapeRegExp, stripHtml } = useHighlight();
  const [searchQuery, setSearchQuery] = useState("");
  const articles = defaultHelp.articles || [];

  const getMatches = (article, query) => {
    if (!query) return [];
    const matches = [];
    const lowerQuery = query.toLowerCase();

    // Check content
    article.content.forEach((item) => {
      let textToCheck = "";
      if (item.type === "paragraph" || item.type === "heading") {
        textToCheck = stripHtml(item.text);
      } else if (item.type === "list") {
        textToCheck = stripHtml(item.items.join(" "));
      } else if (item.type === "image") {
        textToCheck = item.alt;
      }

      if (textToCheck && textToCheck.toLowerCase().includes(lowerQuery)) {
        // Find distinct matches in this block
        const regex = new RegExp(escapeRegExp(query), "gi");
        let match;
        while ((match = regex.exec(textToCheck)) !== null) {
          // Extract snippet found
          const start = Math.max(0, match.index - 30);
          const end = Math.min(
            textToCheck.length,
            match.index + query.length + 30,
          );
          let snippet = textToCheck.substring(start, end);

          if (start > 0) snippet = "..." + snippet;
          if (end < textToCheck.length) snippet = snippet + "...";

          matches.push(snippet);
          if (matches.length >= 2) break; // Limit per content block
        }
      }
    });

    return matches.slice(0, 3); // Return top 3 matches overall
  };

  const filteredArticles = articles
    .map((article) => {
      const matches = getMatches(article, searchQuery);
      const isContentMatch = matches.length > 0;
      const isTitleMatch = article.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const isDescMatch = article.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      if (searchQuery && (isTitleMatch || isDescMatch || isContentMatch)) {
        return { ...article, matches };
      } else if (!searchQuery) {
        return { ...article, matches: [] };
      }
      return null;
    })
    .filter(Boolean);

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
              <Link
                key={index}
                href={`${settings.paths.help?.source}/${article.id}`}
                className={`${styling.components.card} bg-base-200 ${styling.general.box} hover:bg-base-300 transition-colors flex flex-col items-center text-center cursor-pointer h-full`}
              >
                <Title tag="h3" className="mb-2 text-lg">
                  <HighlightedText
                    text={article.title}
                    highlight={searchQuery}
                  />
                </Title>
                <Paragraph className="text-sm border-none!">
                  <HighlightedText
                    text={article.description}
                    highlight={searchQuery}
                  />
                </Paragraph>

                {/* Search Matches from Content */}
                {article.matches && article.matches.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-base-content/10 w-full text-xs text-base-content/70 italic">
                    {article.matches.map((match, idx) => (
                      <div key={idx} className="mb-1">
                        &quot;
                        <HighlightedText text={match} highlight={searchQuery} />
                        &quot;
                      </div>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </Grid>
        ) : null}

        {filteredArticles.length === 0 && (
          <div className={`${styling.flex.center} gap-1 opacity-70 mt-12`}>
            <SvgSearch className="opacity-50" size="size-8" />
            <Paragraph>
              No articles found matching &quot;{searchQuery}&quot;
            </Paragraph>
          </div>
        )}

        {/* Contact Support Link */}
        <HelpContactSupport />
      </TosContent>
    </>
  );
}
