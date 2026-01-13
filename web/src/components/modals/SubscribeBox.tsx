import Image from 'next/image';

export default function SubscribeBox() {
  return (
    <div className="bg-gradient-to-r from-[#006DE3] via-[#34C759] via-[#FFBD60] via-[#FFF6CF] via-[#FF3B30] to-[#CF7CF9] rounded-xl p-[2px]">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white rounded-xl py-4 px-8">
        <div className="flex items-center gap-3">
          <Image src="/tool_Icon.svg" alt="icon" width={40} height={40} className="w-10 h-10" />
          <p className="text-md font-medium text-gray-900 w-[506px]">
            Join <span className="font-bold">500K+ subscribers</span> who get the best of tech every day right to their inbox
          </p>
        </div>
        <form className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="email"
            placeholder="Email"
            className="flex-1 px-3 py-2 rounded-md text-sm border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 cursor-pointer rounded-md bg-black text-white text-sm hover:opacity-90 transition"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}
