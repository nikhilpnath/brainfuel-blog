import { useEffect, useRef, ReactNode } from "react";

type TInfiniteScrollProps = {
  children: ReactNode;
  next: () => void;
  hasMore: boolean;
  loader?: ReactNode;
  dataLength?: number;
  className?: string;
};

const InfiniteScroll = ({
  children,
  next,
  hasMore,
  loader = <p className="py-4 text-center">Loading more...</p>,
  className = "",
}: TInfiniteScrollProps) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry?.isIntersecting && hasMore) {
          next();
        }
      },
      {
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [next, hasMore]);

  return (
    <div className={className}>
      {children}
      {hasMore && (
        <div ref={sentinelRef} className="w-full flex justify-center py-4">
          {loader}
        </div>
      )}
    </div>
  );
};

export default InfiniteScroll;
