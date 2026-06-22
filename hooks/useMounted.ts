"use client";

import { useEffect, useState } from "react";

/** True only after the component has mounted on the client (avoids SSR/client stat mismatches). */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

export function formatDynamicStat(
  mounted: boolean,
  value: string | number,
  placeholder = "--"
): string | number {
  return mounted ? value : placeholder;
}
