"use client";

import { useCallback, useEffect, useState } from "react";
import { getLiveContent } from "@/services/content.service";

export function useLiveFeed(teacherId, intervalMs = 30000) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLiveContent = useCallback(async () => {
    try {
      setError(null);
      const result = await getLiveContent(teacherId);
      setItems(result);
    } catch (err) {
      setError(err.message || "Unable to load live content");
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => {
    fetchLiveContent();
    const timer = setInterval(fetchLiveContent, intervalMs);
    return () => clearInterval(timer);
  }, [fetchLiveContent, intervalMs]);

  return { items, loading, error, refresh: fetchLiveContent };
}
