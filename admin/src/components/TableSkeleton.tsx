import { Skeleton } from "@/components/ui/skeleton"

export function TableSkeleton() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-10 space-x-4 p-20">
      <Skeleton className="h-8 w-8 rounded-full bg-slate-400" />
    </div>
  )
}
