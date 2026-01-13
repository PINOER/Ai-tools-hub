// import type { News } from '@/types/news';

// interface NewsDetailGenericProps {
//   news: News;
// }

const NewsDetailGeneric = ({ news }: any) => {
  console.log("News", news)
  if (!news) return;
  return (
    <div className='py-6 px-12 flex flex-col gap-8'>
      <img
        src={news?.image || '/icons/logo.svg'}
        alt='Featured Image'
        className='w-full h-80 object-cover rounded'
      />
      <div className='flex flex-col gap-2'>
        <p className='text-black font-semibold text-2xl'>{news.headline}</p>
        <div className='flex items-center gap-3 mt-3 text-sm'>
          {news?.categories &&
            news?.categories.map((category:any) => (
              <p className='text-[#000000B2] border border-[#F2F2F2] bg-white px-3 py-1 rounded-md'>
                {category}
              </p>
            ))}
        </div>
        <div className='flex items-center gap-4'>
          <p className='text-[#808080]'>{new Date(news.date).toLocaleDateString()}</p>
          <p className='text-[#808080] flex items-center gap-1 cursor-pointer'>
            Open AI
            <span>
              <svg
                width='9'
                height='8'
                viewBox='0 0 11 10'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M10.5 7.43862C10.5 7.65539 10.4271 7.83676 10.2812 7.98275C10.1353 8.12873 9.96507 8.20173 9.77056 8.20173C9.57162 8.20173 9.40362 8.12873 9.26658 7.98275C9.12953 7.83234 9.06101 7.6576 9.06101 7.45853V4.97678L9.16711 2.24287L8.09284 3.45056L1.77321 9.77439C1.61848 9.9248 1.44385 10 1.24934 10C1.11671 10 0.992927 9.96461 0.877984 9.89383C0.767462 9.82747 0.676835 9.73678 0.606101 9.62177C0.535367 9.50675 0.5 9.38509 0.5 9.2568C0.5 9.06658 0.579576 8.89184 0.738727 8.73258L7.04509 2.40212L8.25199 1.34041L5.40053 1.43995H3.03979C2.84085 1.43995 2.66843 1.37138 2.52255 1.23424C2.37666 1.09268 2.30371 0.924574 2.30371 0.729927C2.30371 0.53528 2.37445 0.364964 2.51592 0.218978C2.65738 0.0729927 2.83864 0 3.05968 0H9.71751C9.95623 0 10.1441 0.0729927 10.2812 0.218978C10.4226 0.36054 10.4934 0.546339 10.4934 0.776377L10.5 7.43862Z'
                  fill='#808080'
                />
              </svg>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailGeneric;
