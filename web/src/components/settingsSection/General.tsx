import Image from "next/image";
import { IoCheckmarkCircle } from "react-icons/io5";

export default function General() {
  return (
    <div>
      <h1 className="font-[inter] text-[14px] font-medium text-[#808080] uppercase mb-[20px]">
        Connected accouts
      </h1>

      <section className="flex gap-2 justify-start items-center mb-[12px]">
        <div className="flex justify-center items-center gap-4">
          <div className="w-[64px] h-[64px] flex justify-center items-center rounded-[15px] bg-black">
            <Image src="/google.svg" alt="google" width={29} height={29} />
          </div>

          <button className="cursor-pointer flex items-center gap-2 font-Nunito font-semibold text-[15px] text-[#4D4D4D] border border-[#E5E5E5] bg-[#F2F2F2] rounded-[10px] py-[2px] pl-[12px] pr-[8px]">
            Connected <IoCheckmarkCircle className="w-[16px] h-[16px]" />
          </button>
        </div>
      </section>

      <section className="flex gap-2 justify-start items-center mb-[12px]">
        <div className="flex justify-center items-center gap-4">
          <div className="w-[64px] h-[64px] flex justify-center items-center rounded-[15px] border border-[#F2F2F2]">
            <Image src="/Apple.svg" alt="apple" width={29} height={29} />
          </div>

          <button className="cursor-pointer flex items-center gap-2 font-Nunito font-semibold text-[15px] text-[#4D4D4D] border border-[#E5E5E5] bg-[#F2F2F2] rounded-[10px] py-[2px] pl-[12px] pr-[8px]">
            Connect
          </button>
        </div>
      </section>

      <section className="flex gap-2 justify-start items-center mb-[12px]">
        <div className="flex justify-center items-center gap-4">
          <div className="w-[64px] h-[64px] flex justify-center items-center rounded-[15px] border border-[#F2F2F2]">
            <Image src="/Facebook.svg" alt="facebook" width={29} height={29} />
          </div>

          <button className="cursor-pointer flex items-center gap-2 font-Nunito font-semibold text-[15px] text-[#4D4D4D] border border-[#E5E5E5] bg-[#F2F2F2] rounded-[10px] py-[2px] pl-[12px] pr-[8px]">
            Connect
          </button>
        </div>
      </section>

      <section className="flex gap-2 justify-start items-center mb-[12px]">
        <div className="flex justify-center items-center gap-4">
          <div className="w-[64px] h-[64px] flex justify-center items-center rounded-[15px] border border-[#F2F2F2]">
            <Image src="/x2.svg" alt="x" width={29} height={29} />
          </div>

          <button className="cursor-pointer flex items-center gap-2 font-Nunito font-semibold text-[15px] text-[#4D4D4D] border border-[#E5E5E5] bg-[#F2F2F2] rounded-[10px] py-[2px] pl-[12px] pr-[8px]">
            Connect
          </button>
        </div>
      </section>

      <div className="border border-[#0000000D] mt-[20px] mb-[20px]" />

      <h2 className="font-[inter] text-[14px] font-medium text-[#808080] uppercase">
        Delete Account
      </h2>

      <p className="font-[inter] text-[14px] font-medium text-[#808080] mb-[20px]">
      THis will delete your account and all associated data?
      </p>

      <button className="cursor-pointer flex items-center gap-2 font-Nunito font-semibold text-[15px] text-[#4D4D4D] border border-[#F2F2F2] bg-white rounded-[10px] py-[2px] px-[20px]">
        Delete account
      </button>
    </div>
  );
}
