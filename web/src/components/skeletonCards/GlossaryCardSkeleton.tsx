export function GlossaryCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
      {/* Title skeleton */}
      <div className="h-6 w-3/4 bg-gray-200 rounded mb-3" />
      
      {/* Definition skeleton */}
      <div className="space-y-2 mb-3">
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
      </div>
      
      {/* Tags skeleton */}
      <div className="flex flex-wrap gap-2">
        <div className="h-6 w-16 bg-gray-200 rounded" />
        <div className="h-6 w-20 bg-gray-200 rounded" />
        <div className="h-6 w-14 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export function GlossaryModalSkeleton() {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="relative w-full h-[90vh] max-w-4xl bg-white rounded-2xl shadow-xl overflow-y-auto animate-pulse">
        {/* Header Skeleton */}
        <div className="relative">
          <div className="px-8 pt-6 pb-0">
            {/* Gradient lines skeleton */}
            <div className="flex flex-col justify-center flex-1 ml-2 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-full h-px bg-gray-200"
                />
              ))}
            </div>
            
            {/* Close button skeleton */}
            <div className="absolute top-4 right-6 w-5 h-5 bg-gray-200 rounded" />
            
            <div className="pt-18">
              {/* Title skeleton */}
              <div className="h-8 w-64 bg-gray-200 rounded mb-4 ml-8" />
              
              {/* Tags skeleton */}
              <div className="flex flex-wrap gap-2 mb-4 ml-8">
                <div className="h-7 w-20 bg-gray-200 rounded" />
                <div className="h-7 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons skeleton */}
        <div className="flex justify-end mr-16 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded" />
            <div className="w-8 h-8 bg-gray-200 rounded" />
            <div className="w-8 h-8 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Body skeleton */}
        <div className="p-8 space-y-6">
          <div className="px-8">
            <section>
              {/* Definition section skeleton */}
              <div className="h-5 w-24 bg-gray-200 rounded mb-3" />
              <div className="space-y-2 mb-6">
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-5/6 bg-gray-200 rounded" />
              </div>
              
              {/* Categories section skeleton */}
              <div className="h-5 w-20 bg-gray-200 rounded mb-3" />
              <div className="flex flex-wrap gap-2 mb-6">
                <div className="h-6 w-24 bg-gray-200 rounded" />
                <div className="h-6 w-28 bg-gray-200 rounded" />
              </div>
              
              {/* Metadata skeleton */}
              <div className="space-y-2">
                <div className="h-4 w-16 bg-gray-200 rounded" />
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-4 w-18 bg-gray-200 rounded" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-28 bg-gray-200 rounded" />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 

export function GlossaryDetailCardSkeleton() {
  return (
      <div className="relative w-full bg-white rounded-[25px] shadow-xl overflow-hidden">

      <div className="py-8 px-4 md:px-22 space-y-5">
        {[...Array(1)].map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-14 w-4xl ml-0 md:ml-31 mx-auto bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-1/2  ml-0 md:ml-31 mt-2  flex justify-center items-center bg-gray-200 rounded animate-pulse" />
            <div className="h-18 w-4xl  ml-0 md:ml-31 mt-2 flex justify-center items-center bg-gray-200 rounded animate-pulse" />
            <div className="flex  gap-2">   
            <div className="w-4xl h-20  ml-0 md:ml-31  mt-4 flex justify-center items-center bg-gray-200 rounded animate-pulse" />
            <div className="w-4xl h-20  ml-0 md:ml-31  mt-4 flex justify-center items-center bg-gray-200 rounded animate-pulse" />
            <div className="w-4xl h-20  ml-0 md:ml-31  mt-4 flex justify-center items-center bg-gray-200 rounded animate-pulse" />
            </div>
           
          </div>
        ))}
      </div>
    </div>
  )
}