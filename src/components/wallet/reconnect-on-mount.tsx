"use client";

import { useEffect, useRef } from "react";
import { useReconnect } from "wagmi";

/** Restores the last wallet session after page load (GitHub Pages / static export). */
export function ReconnectOnMount() {
  const { reconnect } = useReconnect();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    reconnect();
  }, [reconnect]);

  return null;
}