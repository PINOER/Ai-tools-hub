import { SimilerToolType } from "@/types";
import { IoStar } from "react-icons/io5";

export default function SimilerTools({
  name,
  tag,
  tag2,
  star,
  color,
}: SimilerToolType) {
  return (
    <div className="flex ">
      <div
        className="w-[80px] h-[80px] border border-gray-200 rounded-[10px]"
        style={{ background: color }}
      />
      <div className="ml-[20px] flex flex-col">
        <p className="font-[inter] font-medium text-[15px] text-[#000000]">
          {name}
        </p>
        <div className="flex md:flex-col lg:flex-row md:whitespace-nowrap items-center gap-2">
          <span className="bg-[#FFFFFF]  border border-gray-200 text-[#007AFF] font-[Nunito] font-bold text-[12px] px-2 py-0 rounded-[6px] mb-[4px]">
            {tag}
          </span>
          {tag2 && (
            <span className="bg-[#FFFFFF]  border border-gray-200 text-[#007AFF] font-[Nunito] font-bold text-[12px] px-2 py-0 rounded-[6px] mb-[4px]">
              {tag2}
            </span>
          )}
        </div>

        <span className="bg-[#FFFFFF] border border-gray-200 text-[#808080] w-[55px] font-[Nunito] font-bold text-[12px] px-2 py-0.5 rounded-[6px]">
          <span className="flex">
            <IoStar className="mr-[4px] w-[15px] h-[15px]" /> {star}
          </span>
        </span>
      </div>
    </div>
  );
}
