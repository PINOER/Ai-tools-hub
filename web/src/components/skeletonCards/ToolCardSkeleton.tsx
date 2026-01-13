export function ToolCardSkeleton() {
  return (
    <div className="pt-1 w-full rounded-lg animate-pulse bg-gray-50">
      <div className="flex items-start gap-4">
        <div className="rounded-[10px] bg-gray-200" style={{ width: '80px', height: '80px' }} />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
          </div>
          <div className="h-3 w-40 bg-gray-200 rounded mb-2" />
          <div className="h-3 w-32 bg-gray-200 rounded mb-2" />
          <div className="flex flex-wrap gap-3 mt-2">
            <div className="h-5 w-12 bg-gray-200 rounded" />
            <div className="h-5 w-10 bg-gray-200 rounded" />
          </div>
          <div className="flex items-center gap-1 mt-3 text-xs">
            <div className="h-5 w-10 bg-gray-200 rounded" />
            <div className="h-5 w-8 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ToolModalSkeleton() {
  return (
    // <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="relative w-full bg-white rounded-[25px] shadow-xl overflow-hidden">
        {/* Header Skeleton */}
        <div className="relative bg-gradient-to-b from-[#D4D4D4] to-[#EEEEEE]">
          <div className="px-10 pt-18 pb-4 flex items-start justify-between">
            <div className="flex items-start justify-start gap-4">
              <div className="w-[75px] h-[75px] rounded-[10px] bg-gray-200 animate-pulse" />
              <div className="flex-1">
                <div className="h-6 w-32 bg-gray-200 rounded mb-2 animate-pulse" />
                <div className="h-4 w-64 bg-gray-200 rounded mb-2 animate-pulse" />
                <div className="flex gap-2 mt-4">
                  <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Body Skeleton */}
        <div className="py-8 px-22 space-y-5">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    // </div>
  );
}
  
