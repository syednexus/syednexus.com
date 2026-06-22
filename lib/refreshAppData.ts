import { invalidateAnalystCache } from "@/lib/analystData";
import { invalidateDailyCache } from "@/lib/dailyData";
import { invalidateMissionsCache } from "@/lib/missionsData";
import { invalidateNexusDataCache } from "@/lib/nexusData";

export function refreshAppData() {
  if (typeof window === "undefined") {
    return;
  }

  invalidateNexusDataCache();
  invalidateMissionsCache();
  invalidateAnalystCache();
  invalidateDailyCache();
  window.dispatchEvent(new Event("nexus-app-refresh"));
}
