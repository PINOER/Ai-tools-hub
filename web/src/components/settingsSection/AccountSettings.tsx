import Image from "next/image";

export default function AccountSettings() {
    return (
        <div>
            <h2 className="font-[inter] text-[14px] font-medium text-[#808080] uppercase">Avatar</h2>

                <div className="flex gap-3">
                 <div className="w-[80px] h-[80px]  rounded-[15px] border border-[#F2F2F2]">
                   <Image src="/pngImages/new2.png" alt="avatar" width={80} height={80} />
                </div>
                <div className="flex flex-col gap-2">
                    <button className="border border-[#F2F2F2] rounded-[10px] py-[2px] px-[20px] cursor-pointer font-Nunito font-semibold text-[15px] text-[#4D4D4D]">Upload new photo</button>
                    <button className="border border-[#F2F2F2] rounded-[10px] py-[2px] px-[20px] cursor-pointer font-Nunito font-semibold text-[15px] text-[#4D4D4D]">Remove photo</button>
                 </div>
            </div>

            <section className="flex gap-4 justify-start items-center w-full">
                <div className="mt-[20px] mb-[6px] w-1/2">
                    <p className="font-Nunito font-semibold text-[14px] text-[#4D4D4D]">FIRST NAME*</p>
                    <input type="text" placeholder="Type" className="w-full h-[40PX] border border-[#F2F2F2] placeholder:font-Nunito placeholder:font-semibold placeholder:text-[15px] placeholder:text-[#CCCCCC] rounded-[10px] py-[2px] px-[20px] font-Nunito font-semibold text-[15px] text-[#4D4D4D] " />
                </div>

                <div className="mt-[20px] mb-[6px] w-1/2">
                    <p className="font-Nunito font-semibold text-[14px] text-[#4D4D4D]">LAST NAME*</p>
                    <input type="text" placeholder="Type" className="w-full h-[40PX] border border-[#F2F2F2] placeholder:font-Nunito placeholder:font-semibold placeholder:text-[15px] placeholder:text-[#CCCCCC] rounded-[10px] py-[2px] px-[20px] font-Nunito font-semibold text-[15px] text-[#4D4D4D] " />
                </div> 
            </section>

            <section className="flex gap-4 justify-start items-center w-full">
                <div className="mt-[20px] mb-[6px] w-1/2">
                    <p className="font-Nunito font-semibold text-[14px] text-[#4D4D4D]">USERNAME*</p>
                    <input type="text" placeholder="Type" className="w-full h-[40PX] border border-[#F2F2F2] placeholder:font-Nunito placeholder:font-semibold placeholder:text-[15px] placeholder:text-[#CCCCCC] rounded-[10px] py-[2px] px-[20px] font-Nunito font-semibold text-[15px] text-[#4D4D4D] " />
                </div>

                <div className="mt-[20px] mb-[6px] w-1/2">
                    <p className="font-Nunito font-semibold text-[14px] text-[#4D4D4D]">EMAIL*</p>
                    <input type="email" placeholder="Type" className="w-full h-[40PX] border border-[#F2F2F2] placeholder:font-Nunito placeholder:font-semibold placeholder:text-[15px] placeholder:text-[#CCCCCC] rounded-[10px] py-[2px] px-[20px] font-Nunito font-semibold text-[15px] text-[#4D4D4D] " />
                </div> 
            </section>

            <section className="flex gap-4 justify-start items-center w-full">
                <div className="mt-[20px] mb-[6px] w-full">
                    <p className="font-Nunito font-semibold text-[14px] text-[#4D4D4D] ml-1">BIO</p>
                    <input type="text" placeholder="Type" className="w-full h-[40PX] border border-[#F2F2F2] placeholder:font-Nunito placeholder:font-semibold placeholder:text-[15px] placeholder:text-[#CCCCCC] rounded-[10px] py-[2px] px-[20px] font-Nunito font-semibold text-[15px] text-[#4D4D4D] " />
                </div>
            </section>

            <section className="flex gap-4 justify-start items-center w-full">
                <div className="mt-[20px] mb-[6px] w-1/2">
                    <button  className="w-full h-[40PX] border border-[#F2F2F2] placeholder:font-Nunito placeholder:font-semibold placeholder:text-[15px] placeholder:text-[#CCCCCC] rounded-[10px] py-[2px] px-[20px] font-Nunito font-semibold text-[15px] text-[#4D4D4D] cursor-pointer" >Cancel</button>
                </div>

                <div className="mt-[20px] mb-[6px] w-1/2">
                    <button className="w-full h-[40PX] border bg-black text-white border-[#F2F2F2] placeholder:font-Nunito placeholder:font-semibold placeholder:text-[15px] placeholder:text-[#CCCCCC] rounded-[10px] py-[2px] px-[20px] font-Nunito font-semibold text-[15px] cursor-pointer" >Save</button>
                </div> 
            </section>
        </div>
    )
}