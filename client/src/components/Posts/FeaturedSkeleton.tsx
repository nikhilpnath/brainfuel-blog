const FeaturedSkeleton = () => {
  return (
    <div
      aria-label="Loading featured posts"
      role="status"
      className="flex flex-col lg:flex-row gap-8 mt-8 animate-pulse"
    >
      {/* First / Hero section skeleton */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        <div className="w-full h-72 md:h-96 bg-gray-200 rounded-3xl" />
        <div className="flex items-center gap-4">
          <div className="w-8 h-4 bg-gray-200 rounded" />
          <div className="w-24 h-4 bg-gray-200 rounded" />
          <div className="w-20 h-4 bg-gray-200 rounded" />
        </div>
        <div className="w-4/5 h-8 bg-gray-200 rounded mt-1" />
        <div className="w-3/5 h-8 bg-gray-200 rounded" />
      </div>

      {/* Remaining 3 cards skeleton */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6 justify-between">
        {[1, 2, 3].map((i) => (
          <div className="flex justify-between gap-4" key={i}>
            <div className="w-1/3 aspect-video bg-gray-200 rounded-3xl shrink-0" />
            <div className="w-2/3 flex flex-col gap-2 justify-center">
              <div className="flex items-center gap-3">
                <div className="w-6 h-3 bg-gray-200 rounded" />
                <div className="w-20 h-3 bg-gray-200 rounded" />
                <div className="w-16 h-3 bg-gray-200 rounded" />
              </div>
              <div className="w-full h-5 bg-gray-200 rounded mt-1" />
              <div className="w-3/4 h-5 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedSkeleton;
