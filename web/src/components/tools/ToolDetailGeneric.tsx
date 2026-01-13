import type { Tools } from "@/types/tools";
import Image from "next/image";

interface ToolDetailGenericProps {
  tool: Omit<Tools, "id">;
}

const ToolDetailGeneric = ({ tool }: ToolDetailGenericProps) => {
  if (!tool) return;
  return (
    <div
      style={{
        background: "linear-gradient(92.51deg, #EEEEEE 9.56%, #D4D4D4 95.21%)",
      }}
      className=" py-[20px] w-full overflow-x-hidden flex flex-col md:flex-row gap-4 px-6"
    >
      <Image
        src={
          tool?.avatar &&
          typeof tool.avatar === "object" &&
          "name" in tool.avatar
            ? URL.createObjectURL(tool.avatar as File)
            : tool?.avatar || ""
        }
        alt="Tool Logo"
        width={0}
        height={0}
        className="rounded-[10px] border h-[80px] w-[80px] object-cover"
        unoptimized={true}
      />
      <div className="flex flex-col gap-2">
        <p className="text-black font-medium text-[25px] font-[inter]">
          {tool?.name}
        </p>
        <p className="text-[#808080] text-[15px] font-medium min-w-lg">
          {tool?.full_description}
        </p>
        <div className="flex items-center gap-3 mt-3 text-sm">
          {tool?.tool_categories &&
            tool?.tool_categories.map(({ category }, index) => (
              <p
                key={`${category.id}-${index}`}
                className="bg-[#FFFFFF] text-[#007AFF] font-medium text-[12px] px-2 py-1 rounded-[9px]"
              >
                {category.name}
              </p>
            ))}
        </div>
      </div>
      <div className="flex items-start gap-2">
        <div className="flex gap-1 px-3 items-center justify-center bg-white py-1 rounded-md opacity-0">
          <p className="text-[15px] font-medium font-[inter]">4.56</p>
          <svg
            width="18"
            height="16"
            viewBox="0 0 18 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mb-1"
          >
            <path
              d="M3.8644 15.3545C3.51634 15.1105 3.44228 14.7062 3.64223 14.1556L5.16779 9.89647L1.27984 7.26853C0.776254 6.93394 0.568896 6.56449 0.709603 6.17413C0.85031 5.79074 1.2354 5.60254 1.85007 5.60951L6.6193 5.63739L8.0708 1.35739C8.26335 0.799739 8.56698 0.5 8.9965 0.5C9.43343 0.5 9.73707 0.799739 9.92221 1.35739L11.3737 5.63739L16.1429 5.60951C16.7576 5.60254 17.1501 5.79074 17.2908 6.17413C17.4315 6.56449 17.2168 6.93394 16.7206 7.26853L12.8326 9.89647L14.3508 14.1556C14.5507 14.7062 14.4767 15.1105 14.136 15.3545C13.7879 15.6055 13.351 15.5218 12.8474 15.1802L8.9965 12.5174L5.14558 15.1802C4.64199 15.5218 4.21247 15.6055 3.8644 15.3545Z"
              fill="#808080"
            />
          </svg>

          <p className="text-[#808080] text-[15px] font-medium font-[inter]">
            {" "}
            (124)
          </p>
        </div>
        <div
          onClick={() => {
            window.open(tool.website_url, "_blank", "noopener,noreferrer");
          }}
          className="flex items-center justify-center gap-1 text-[15px] font-Nunito font-semibold cursor-pointer bg-black text-white rounded-md px-4 py-1"
        >
          Visit
          <Image
            src="/arrow-up.svg"
            alt="Visit Tool Link"
            width={16}
            height={16}
          />
        </div>
      </div>
    </div>
  );
};

export default ToolDetailGeneric;
