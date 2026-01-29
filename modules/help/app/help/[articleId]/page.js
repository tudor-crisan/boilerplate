import { defaultHelp } from "@/modules/general/libs/defaults";
import { getMetadata } from "@/modules/general/libs/seo";
import HelpArticle from "@/modules/help/components/help/HelpArticle";

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
