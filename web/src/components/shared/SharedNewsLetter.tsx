import Image from "next/image";

interface SharedNewsLetterProps {
    subscribed: boolean;
    setSubscribed: (subscribed: boolean) => void;
}

export default function SharedNewsLetter({ subscribed, setSubscribed }: SharedNewsLetterProps) {

    const clickHandler = () => {
        setSubscribed(false)
    }

    return (
        <div className="flex flex-col justify-center items-center mt-[40px]">
            <Image src="/mail.svg" alt="mail" width={138} height={87} />
            <Image src="/newsletter.svg" alt="newsletter" width={140} height={43} className="mt-[10px]" />
            <div className="flex justify-center items-center p-[20px] rounded-[15px]  bg-[#F7F7F7] mt-[40px]">
                {subscribed ? (
                    <div className="flex gap-2">
                        <input type="text" placeholder="Email" className="py-[2px] pl-[16px] rounded-[10px] bg-[#FFFFFF] border border-[#F2F2F2] focus:outline-none focus:ring-1 focus:ring-blue-200 placeholder-[#CCCCCC] " />
                        <button className="py-[2px] px-[20px] bg-[#000000] text-white rounded-[10px] font-[Nunito] font-semibold text-[15px]" onClick={clickHandler}>Subscribe</button>
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="font-[inter] font-medium text-[15px]">You are subscribed to our newsletter</p>
                        <button className="px-[20px] py-[2px] bg-[#000000] text-white rounded-[10px] mt-[8px] ">Unsubscribe</button>
                    </div>
                )}
            </div>
            <p className="font-medium text-[20px] font-[inter] text-center mt-[40px]">Discover the best AI tools.<br />Read best curated AI content.<br /> Join 50,000+ AI enthusiasts.</p>
        </div>
    )
}