interface ArticleBodyProps {
  html: string;
}

export function ArticleBody({ html }: ArticleBodyProps) {
  return (
    <div
      className="prose-beauty"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
