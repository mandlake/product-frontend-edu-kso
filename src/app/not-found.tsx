"use client";

import { ErrorPageTemplate, errorPageContent } from "@/widgets/error-page";

export default function NotFoundPage() {
  const content = errorPageContent.notFound;

  return (
    <ErrorPageTemplate
      title={content.title}
      description={content.description}
    />
  );
}
