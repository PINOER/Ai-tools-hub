import Image from "next/image"
import { FiX } from "react-icons/fi"

interface ToolTag {
  tool_id: number;
  tag_id: number;
  tag: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
}

interface Tool {
  setShowRegister: (show: boolean) => void;
  avatar: string;
  name: string;
  description: string;
  tags: ToolTag[];
}

export const ConfirmRegister = ({ setShowRegister, avatar, name, description, tags }: Tool) => {
    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
        <div className="relative w-full h-[55vh] max-w-2xl bg-white rounded-2xl shadow-xl overflow-y-auto  py-[20px] px-[40px]">
          <p className="text-[27px] font-sf-pro-rounded font-medium text-[#CCCCCC]">
            Claim tool
          </p>
          <button
            onClick={() => setShowRegister(false)}
            className="absolute cursor-pointer top-4 right-6 text-gray-400 hover:text-black transition-colors"
          >
            <FiX size={20} />
          </button>
            <div className=" mt-[40px]">
              <Image
                src="/magic-selected-icon.svg"
                alt="close"
                width={32}
                height={32}
                className="bg-[#007AFF] rounded-full p-1"
              />
            </div>
          <p className="font-[inter] font-medium text-[20px] mt-[40px]">
            Claim request for an ai tool has been sent
          </p>
          
            <div className="mt-[40px] p-[12px] bg-[#F7F7F7] ">
              <div className="flex items-center gap-2">
                <div className="">
                  <Image src={avatar} alt="toolName" width={80} height={80} className="object-cover w-[75px] h-[75px] rounded-[10px] p-1"/>
                </div>
                <div>
                  <p className="font-[inter] font-medium text-[15px] text-[#000000]">
                    {name}
                  </p>
                  <p className="font-[inter] font-medium text-[15px] text-[#808080]">
                    {description}
                  </p>
                    <div className="flex items-center gap-2">
                     {
                       tags.map((item, index) => (
                         <div key={index} className="border border-[#F2F2F2] rounded-[5px] py-[2px] px-[6px] font-Nunito font-semibold text-[12px] text-[#007AFF] bg-[#FFFFFF]">
                         {item.tag.name}
                       </div>
                       ))
                     }
                   
                 
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-[40px]">
          <div className="mt-[20px] flex gap-4">
            <button
              onClick={() => setShowRegister(false)}
              className="cursor-pointer border border-[#F2F2F2] w-1/2 rounded-md py-1 px-4"
            >
              Cancel
            </button>
            <button onClick={() => setShowRegister(false)} className="cursor-pointer border border-[#F2F2F2] bg-black text-white w-1/2 rounded-md py-1 px-4">
              Okay
            </button>
          </div>
        </div>
        </div>
      </div>
    )
}  