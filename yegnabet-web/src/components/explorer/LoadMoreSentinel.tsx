import { useEffect, useRef } from "react";

interface LoadMoreSentinelProps {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
}

export function LoadMoreSentinel({
  hasMore,
  loading,
  onLoadMore,
}: LoadMoreSentinelProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element || !hasMore) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          const entry = entries[0];

          if (
            entry.isIntersecting &&
            !loading
          ) {
            onLoadMore();
          }
        },
        {
          rootMargin: "500px",
        }
      );

    observer.observe(element);

    return () => observer.disconnect();
  }, [
    hasMore,
    loading,
    onLoadMore,
  ]);

  return (
    <div
      ref={ref}
      className="flex min-h-16 items-center justify-center"
    >
      {loading && (
        <div
          className="
            size-5
            animate-spin
            rounded-full
            border-2
            border-gray-200
            border-t-yegna-700
            dark:border-white/10
            dark:border-t-yegna-400
          "
        />
      )}

      {!loading && !hasMore && (
        <p className="text-xs text-gray-400">
          You've reached the end.
        </p>
      )}
    </div>
  );
}