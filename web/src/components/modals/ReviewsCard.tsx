import { ReviewsType } from '@/types/components';
import { GoThumbsup } from 'react-icons/go';


export default function ReviewsCard({ name, description }: ReviewsType) {
  return (
    <div className="flex flex-col gap-1 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-[#B94A4A] flex items-center justify-center text-white font-bold text-sm">{name[0]}</span>
          <span className="font-semibold text-sm text-gray-900">{name}</span>
        </div>
        <span className="font-medium text-[15px] text-gray-400">May 15, 2025</span>
      </div>
      <div className="flex items-center gap-1 mt-1">
        <span className='flex border border-gray-200 rounded-[6px] px-1 py-1 gap-1'>
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-4 h-4 text-black fill-black" viewBox="0 0 20 20"><polygon points="10,1 12,7 18,7 13,11 15,17 10,13 5,17 7,11 2,7 8,7" /></svg>
          ))}
        </span>
        <span className="ml-2 font-semibold text-sm text-black">5.0</span>
      </div>
      <div className="font-medium text-[15px] text-gray-700 mt-1">
        {description}
      </div>
      <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
        <button className="flex items-center border border-gray-200 rounded-[8px] bg-[#F7F7F7] px-2 py-1 gap-1 hover:text-black transition">
          {/* <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M14 9l-5 5-5-5" /></svg> */}
          <GoThumbsup />
          12
        </button>
      </div>
    </div>
  )
}