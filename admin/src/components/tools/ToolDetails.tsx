import React from "react";
import type { Tools } from "@/types/tools";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

interface ToolDetailProps {
  tool: Omit<Tools, "id">;
  selectedScreenshots?: (File | string)[];
  is_featured?: boolean;
  onFeaturedChange?: (isFeatured: boolean) => void;
}

const ToolDetails = ({
  tool,
  selectedScreenshots,
  is_featured,
  onFeaturedChange,
}: ToolDetailProps) => {
  const [isFeatured, setIsFeatured] = React.useState(is_featured);

  React.useEffect(() => {
    setIsFeatured(is_featured);
  }, [is_featured]);

  const handleStarClick = () => {
    const newValue = !isFeatured;
    setIsFeatured(newValue);
    if (onFeaturedChange) {
      onFeaturedChange(newValue);
    }
  };

  return (
    <div className="flex flex-col gap-3  px-6">
      <div className="flex flex-col gap-5 justify-center">
        <div className="w-full flex gap-2 justify-end items-center">
          {tool.is_featured || isFeatured ? (
            <div className="rounded-[10px] border-[#F2F2F2] border w-[32px] h-[32px] flex items-center justify-center">
              <AiFillStar
                size={15}
                color="black"
                className="cursor-pointer  "
                onClick={handleStarClick}
              />
            </div>
          ) : (
            <div className="rounded-[10px] border-[#F2F2F2] border w-[32px] h-[32px] flex items-center justify-center">
              <AiOutlineStar
                size={15}
                color="black"
                className="cursor-pointer"
                onClick={handleStarClick}
              />
            </div>
          )}
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="cursor-pointer"
          >
            <rect
              x="0.5"
              y="0.5"
              width="31"
              height="31"
              rx="9.5"
              fill="white"
            />
            <rect
              x="0.5"
              y="0.5"
              width="31"
              height="31"
              rx="9.5"
              stroke="#F2F2F2"
            />
            <path
              d="M12.6016 22.6666C11.9644 22.6666 11.4826 22.5073 11.1562 22.1887C10.8297 21.8702 10.6665 21.3981 10.6665 20.7726V15.0384C10.6665 14.4168 10.8297 13.9467 11.1562 13.6281C11.4826 13.3057 11.9644 13.1444 12.6016 13.1444H14.3125V14.2925H12.6724C12.3971 14.2925 12.1867 14.3643 12.0411 14.5081C11.8995 14.6479 11.8287 14.8597 11.8287 15.1433V20.6736C11.8287 20.9572 11.8995 21.1689 12.0411 21.3088C12.1867 21.4525 12.3971 21.5244 12.6724 21.5244H19.3214C19.5928 21.5244 19.8012 21.4525 19.9467 21.3088C20.0962 21.1689 20.1709 20.9572 20.1709 20.6736V15.1433C20.1709 14.8597 20.0962 14.6479 19.9467 14.5081C19.8012 14.3643 19.5928 14.2925 19.3214 14.2925H17.6872V13.1444H19.3981C20.0352 13.1444 20.517 13.3057 20.8435 13.6281C21.1699 13.9467 21.3332 14.4168 21.3332 15.0384V20.7726C21.3332 21.3942 21.1699 21.8643 20.8435 22.1829C20.517 22.5054 20.0352 22.6666 19.3981 22.6666H12.6016ZM15.9998 18.0221C15.8504 18.0221 15.7206 17.9696 15.6105 17.8647C15.5043 17.7598 15.4512 17.6355 15.4512 17.4918V11.6235L15.4984 10.7552L15.1267 11.1806L14.3007 12.0547C14.2063 12.1596 14.0844 12.212 13.9349 12.212C13.7973 12.212 13.6813 12.1693 13.5869 12.0838C13.4964 11.9945 13.4512 11.8818 13.4512 11.7458C13.4512 11.6215 13.5003 11.5069 13.5987 11.402L15.581 9.51973C15.6557 9.4498 15.7265 9.40124 15.7933 9.37404C15.8602 9.34685 15.929 9.33325 15.9998 9.33325C16.0706 9.33325 16.1395 9.34685 16.2063 9.37404C16.2732 9.40124 16.342 9.4498 16.4128 9.51973L18.3951 11.402C18.4974 11.5069 18.5485 11.6215 18.5485 11.7458C18.5485 11.8818 18.4993 11.9945 18.401 12.0838C18.3066 12.1693 18.1926 12.212 18.0588 12.212C17.9133 12.212 17.7914 12.1596 17.6931 12.0547L16.8671 11.1806L16.5013 10.7552L16.5485 11.6235V17.4918C16.5485 17.6355 16.4934 17.7598 16.3833 17.8647C16.2771 17.9696 16.1493 18.0221 15.9998 18.0221Z"
              fill="black"
            />
          </svg>
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="cursor-pointer"
          >
            <rect
              x="0.5"
              y="0.5"
              width="31"
              height="31"
              rx="9.5"
              fill="white"
            />
            <rect
              x="0.5"
              y="0.5"
              width="31"
              height="31"
              rx="9.5"
              stroke="#F2F2F2"
            />
            <path
              d="M12.7398 22.6666C12.5104 22.6666 12.3288 22.5875 12.195 22.4293C12.065 22.2751 12 22.0621 12 21.7903V11.1772C12 10.5727 12.1453 10.1142 12.4358 9.80184C12.7264 9.48945 13.1546 9.33325 13.7204 9.33325H18.2796C18.8454 9.33325 19.2736 9.48945 19.5642 9.80184C19.8547 10.1142 20 10.5727 20 11.1772V21.7903C20 22.0621 19.9331 22.2751 19.7993 22.4293C19.6693 22.5875 19.4915 22.6666 19.2659 22.6666C19.1092 22.6666 18.9658 22.6159 18.8358 22.5144C18.7059 22.4171 18.5166 22.2406 18.2681 21.985L16.0487 19.6603C16.0182 19.6238 15.9857 19.6238 15.9513 19.6603L13.7376 21.985C13.4891 22.2406 13.298 22.4171 13.1642 22.5144C13.0342 22.6159 12.8927 22.6666 12.7398 22.6666ZM13.2846 20.6827L15.6244 18.2729C15.7467 18.1511 15.8729 18.0903 16.0029 18.0903C16.1329 18.0903 16.2571 18.1511 16.3756 18.2729L18.7211 20.6827C18.7594 20.7233 18.7957 20.7375 18.8301 20.7253C18.8683 20.7172 18.8875 20.6827 18.8875 20.6219V11.2441C18.8875 10.9966 18.8282 10.8141 18.7097 10.6964C18.595 10.5747 18.4229 10.5138 18.1935 10.5138H13.8122C13.579 10.5138 13.4031 10.5747 13.2846 10.6964C13.1699 10.8141 13.1125 10.9966 13.1125 11.2441V20.6219C13.1125 20.6827 13.1297 20.7172 13.1642 20.7253C13.2024 20.7375 13.2425 20.7233 13.2846 20.6827Z"
              fill="black"
            />
          </svg>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-[#00000033] font-medium font-[inter] text-[15px] ">
            ABOUT
          </p>
          <div
            className="text-[15px] text-[#000000] font-medium leading-[20px]"
            dangerouslySetInnerHTML={{ __html: tool?.full_description || "" }}
          />
        </div>

        <div className="flex flex-col gap-0">
          <p className="text-[#00000033] font-medium font-[inter] text-[15px] mb-1 uppercase">
            KEY FEATURES
          </p>
          <div
            className="mt-2 text-[15px] font-[inter] text-[#000000] font-medium leading-[20px]"
            dangerouslySetInnerHTML={{ __html: tool.features || "" }}
          />
        </div>

        <div className="flex flex-col gap-0">
          <p className="font-medium font-[inter] text-[15px] mb-1 text-[#00000033] uppercase">
            USE CASES
          </p>
          <div
            className="mt-2 text-[15px] font-[inter] text-[#000000] font-medium leading-[20px]"
            dangerouslySetInnerHTML={{ __html: tool.use_cases || "" }}
          />
        </div>

        <div className="flex flex-col gap-0">
          <p className="font-medium font-[inter] text-[15px] mb-1 text-[#00000033] uppercase">
            TAGS
          </p>
          <div className="flex flex-wrap gap-2 mt-1">
            {tool?.tool_tags?.map(({ tag }, index) => (
              <p
                key={`${tag.id}-${index}`}
                className="px-2 font-Nunito font-semibold py-0.5 text-[12px] border border-[#F2F2F2] rounded-md text-xs text-gray-700"
              >
                #{tag.name}
              </p>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-0">
          <p className="font-medium font-[inter]  text-[15px] mb-1 text-[#00000033] uppercase">
            PRICING
          </p>
          <p className="flex flex-wrap gap-2 mt-1">
            <span className="px-2 font-Nunito font-semibold py-0.5 text-[12px] border border-[#F2F2F2] rounded-md text-xs text-gray-700">
              {tool.pricing_model}
            </span>
            <span className="px-2 font-Nunito font-semibold py-0.5 text-[12px] border border-[#F2F2F2] rounded-md text-xs text-gray-700">
              Enterprise - Custom Pricing
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-0">
          <p className="font-medium font-[inter]  text-[15px] mb-1 text-[#00000033] uppercase">
            PLATFORM
          </p>
          <p className="flex flex-wrap gap-2 mt-1">
            {Array.isArray(tool?.platform_availability) ? (
              tool.platform_availability.map((platform) => (
                <span
                  key={platform}
                  className="px-2 font-Nunito font-semibold py-0.5 text-[12px] border border-[#F2F2F2] rounded-md text-xs text-gray-700"
                >
                  {platform}
                </span>
              ))
            ) : tool?.platform_availability ? (
              <span className="border border-[#F2F2F2] px-2 py-1 rounded-md">
                {tool.platform_availability}
              </span>
            ) : null}
          </p>
        </div>

        <div className="flex flex-col gap-0">
          <p className="font-medium fomt-[inter] text-[15px] mb-1 text-[#00000033] uppercase">
            SCREENSHOTS
          </p>
          <PhotoProvider>
            <div className="flex gap-1 overflow-x-auto">
              {selectedScreenshots &&
                selectedScreenshots.map(
                  (file: File | string, index: number) => {
                    const src =
                      typeof file === "string"
                        ? file
                        : URL.createObjectURL(file);
                    return (
                      <PhotoView key={index} src={src}>
                        <img
                          key={index}
                          src={src}
                          alt={`preview-${index}`}
                          width={270}
                          height={170}
                          className="rounded-lg border object-cover"
                        />
                      </PhotoView>
                    );
                  }
                )}
            </div>
          </PhotoProvider>
        </div>
      </div>
    </div>
  );
};

export default ToolDetails;
