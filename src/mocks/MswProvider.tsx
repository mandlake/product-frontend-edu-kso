"use client";

import { useEffect, useState } from "react";

export default function MswProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (process.env.NODE_ENV !== "development") {
        setIsReady(true);
        return;
      }

      const { worker } = await import("./browser");

      await worker.start();

      setIsReady(true);
    };

    init();
  }, []);

  if (!isReady) return null;

  return <>{children}</>;
}
