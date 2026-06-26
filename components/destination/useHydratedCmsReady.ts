"use client";

import { useEffect, useState } from "react";

import { useNexusDataStatus } from "@/hooks/useNexusData";

/** Avoid SSR/client mismatch when session cache hydrates CMS data before fetch completes. */
export function useHydratedCmsReady() {
  const { loading } = useNexusDataStatus();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted && !loading;
}
