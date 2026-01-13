
import { NewsCardProps } from "@/types/components";
import Image from "next/image";
import Link from "next/link";

export default function NewsCard({
  image,
  title,
  tags,
  time,
  color,
  url,
}: NewsCardProps) {
  return (
    <Link href={url || ""} className="block">
    <div
      className="rounded-xl overflow-hidden cursor-pointer"
    >
      <Image
        src={image}
        alt={title}
        width={400}
        height={192}
        className="h-[200px] w-full object-cover rounded-[10px]"
      />
      <div className="py-4 sm:pb-0 md:pb-0">
        <h3 className="text-[15px] font-medium text-black">{title}</h3>
        <div className="flex flex-wrap items-center gap-2 text-xs mb-2 mt-2 sm:mb-0">
          {tags && tags.length > 0 ? tags.map((tag, i) => (
            <span
              key={i}
              className="font-semibold font-[Nunito] text-[12px] rounded-[5px] border-[1px] border-[#F2F2F2] py-[2px] px-[6px]"
              style={{ color: color }}
            >
              {tag}
            </span>
          )) : (
            <span style={{ color: color }} className="font-semibold font-[Nunito] text-[12px] rounded-[5px] border-[1px] border-[#F2F2F2] py-[2px] px-[6px]">
              No tags
              </span>
          )}
          <span className="text-gray-400">
            {(() => {
              if (!time) return "--:--";
              const date = new Date(time);
              return isNaN(date.getTime()) ? time : date.toLocaleDateString();
            })()}
          </span>
        </div>
      </div>
    </div>
    </Link>
  );
}
