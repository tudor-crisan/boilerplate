import HelpArticle from "@/components/help/HelpArticle";
import { defaultHelp } from "@/libs/defaults";
import { getMetadata } from "@/libs/seo";

export async function generateMetadata(props) {
  const params = await props.params;
  const article = defaultHelp?.articles?.find((a) => a.id === params.articleId);
  if (article) {
    return {
      title: `${article.title} | Help`,
      description: article.description,
    };
  }
  return getMetadata("help");
}

export default function ArticlePage() {
  return <HelpArticle />;
}
