export function NewsCardSkeleton() {
    return (
        <div className="relative w-full bg-white rounded-[25px] overflow-hidden">
          <div className="py-8 px-4 md:px-22 space-y-5">
            {[...Array(1)].map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="w-full  h-[200px] md:w-[920px] md:h-[420px] mx-auto bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-1/2  ml-0 md:ml-31 mt-2  flex justify-center items-center bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-1/2  ml-0 md:ml-31 mt-2 flex justify-center items-center bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-1/2 ml-0 md:ml-31 mt-4 flex justify-center items-center bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-1/2 ml-0 md:ml-31 mt-4 flex justify-center items-center bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-1/2 ml-0 md:ml-31 mt-4 flex justify-center items-center bg-gray-200 rounded animate-pulse" />
                <div className="w-full  h-[200px] md:w-[920px] md:h-[420px] ml-0 md:ml-31  mt-4 flex justify-center items-center bg-gray-200 rounded animate-pulse" />
                <div className="w-full  h-[200px] md:w-[920px] md:h-[420px] ml-0 md:ml-31  mt-4 flex justify-center items-center bg-gray-200 rounded animate-pulse" />
                <div className="w-full  h-[200px] md:w-[920px] md:h-[420px]  ml-0 md:ml-31  mt-4 flex justify-center items-center bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
    )
}

export function NewsCardGridSkeleton() {
    return (
        <div className="relative w-full bg-white rounded-[25px] overflow-hidden animate-pulse">
          <div className="aspect-video bg-gray-200 rounded-t-[25px]" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded w-16" />
              <div className="h-6 bg-gray-200 rounded w-20" />
            </div>
            <div className="h-3 bg-gray-200 rounded w-12" />
          </div>
        </div>
    )
}