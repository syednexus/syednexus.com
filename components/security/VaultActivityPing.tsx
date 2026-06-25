"use client";

import { getSession, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

const ACTIVITY_INTERVAL_MS = 5 * 60 * 1000;
const MIN_PING_GAP_MS = 4 * 60 * 1000;

export default function VaultActivityPing() {
  const { status, update } = useSession();
  const updateRef = useRef(update);
  const statusRef = useRef(status);
  const lastPingAtRef = useRef(0);
  const inFlightRef = useRef(false);
  const pingRef = useRef<(() => Promise<void>) | undefined>(undefined);

  updateRef.current = update;
  statusRef.current = status;

  useEffect(() => {
    async function ping() {
      if (statusRef.current !== "authenticated") return;
      if (inFlightRef.current) return;

      const now = Date.now();
      if (now - lastPingAtRef.current < MIN_PING_GAP_MS) return;

      inFlightRef.current = true;
      try {
        const session = await getSession();
        const sessionLastActivity = session?.user?.lastActivityAt;
        if (
          typeof sessionLastActivity === "number" &&
          now - sessionLastActivity < MIN_PING_GAP_MS
        ) {
          lastPingAtRef.current = sessionLastActivity;
          return;
        }

        const response = await fetch("/api/auth/mfa/activity", {
          method: "POST",
          credentials: "include"
        });
        if (!response.ok) return;

        const data = (await response.json()) as {
          lastActivityAt?: number;
          verifiedAt?: number;
          activityProof?: string;
        };
        const lastActivityAt = data.lastActivityAt ?? now;
        const verifiedAt = data.verifiedAt ?? lastActivityAt;
        lastPingAtRef.current = lastActivityAt;
        await updateRef.current({
          lastActivityAt,
          verifiedAt,
          activityProof: data.activityProof
        });
      } catch {
        // ignore transient network errors
      } finally {
        inFlightRef.current = false;
      }
    }

    pingRef.current = ping;

    const intervalId = window.setInterval(() => {
      void ping();
    }, ACTIVITY_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;
    void pingRef.current?.();
  }, [status]);

  return null;
}
