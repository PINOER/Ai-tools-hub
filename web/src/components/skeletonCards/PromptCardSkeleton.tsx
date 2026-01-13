export function PromptCardSkeleton() {
  return (
    <div className="bg-[#F7F7F7] border border-[#F2F2F2] rounded-[9px] px-[10px] py-[12px] h-[70px] animate-pulse">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-4 h-4 bg-gray-200 rounded" />
        <div className="h-4 w-32 bg-gray-200 rounded" />
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="h-5 w-12 bg-gray-200 rounded-[5px]" />
        <div className="h-5 w-10 bg-gray-200 rounded-[5px]" />
        <div className="h-5 w-14 bg-gray-200 rounded-[5px]" />
      </div>
    </div>
  );
}

export function PromptCardsSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mt-3">
      {[...Array(8)].map((_, index) => (
        <PromptCardSkeleton key={index} />
      ))}
    </div>
  );
} 

export function PromptDetailCardSkeleton() {
  return (
      <div className="relative w-full bg-white rounded-[25px] shadow-xl overflow-hidden">

      <div className="py-8 px-4 md:px-22 space-y-5">
        {[...Array(1)].map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-14 w-4xl ml-0 md:ml-31 mx-auto bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-1/2  ml-0 md:ml-31 mt-2  flex justify-center items-center bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-1/2  ml-0 md:ml-31 mt-2 flex justify-center items-center bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-1/2 ml-0 md:ml-31 mt-4 flex justify-center items-center bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-1/2 ml-0 md:ml-31 mt-4 flex justify-center items-center bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-1/2 ml-0 md:ml-31 mt-4 flex justify-center items-center bg-gray-200 rounded animate-pulse" />
            <div className="w-4xl h-20  ml-0 md:ml-31  mt-4 flex justify-center items-center bg-gray-200 rounded animate-pulse" />
            <div className="w-4xl h-20  ml-0 md:ml-31  mt-4 flex justify-center items-center bg-gray-200 rounded animate-pulse" />
            <div className="w-4xl h-20  ml-0 md:ml-31  mt-4 flex justify-center items-center bg-gray-200 rounded animate-pulse" />
            <div className="w-4xl h-20  ml-0 md:ml-31  mt-4 flex justify-center items-center bg-gray-200 rounded animate-pulse" />
            <div className="w-4xl h-20  ml-0 md:ml-31  mt-4 flex justify-center items-center bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
