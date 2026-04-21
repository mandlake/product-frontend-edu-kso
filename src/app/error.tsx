"use client";

import { useEffect } from "react";
import { ErrorPageTemplate, errorPageContent } from "@/widgets/error-page";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error }: Props) {
  const content = errorPageContent.serverError;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorPageTemplate
      title={content.title}
      description={content.description}
    />
  );
}
