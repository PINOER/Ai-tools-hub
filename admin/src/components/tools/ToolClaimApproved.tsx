import { type Tools } from '@/types/tools';
import DialogContainer from '@/components/DialogContainer';
import Card from '@/components/Card';

interface ToolClaimApprovedDialogProps {
  tool: Tools | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ToolClaimApprovedDialog = ({
  tool,
  open,
  onOpenChange,
}: ToolClaimApprovedDialogProps) => {
  if (!tool) return null;

  return (
    <DialogContainer
      title='Claim tool'
      open={open}
      onOpenChange={onOpenChange}
      maxWidth='2xl'
    >
      <div className='flex flex-col gap-10 p-6'>
        <svg
          width='40'
          height='40'
          viewBox='0 0 40 40'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='mt-6'
        >
          <rect width='40' height='40' rx='20' fill='black' />
          <rect
            x='0.5'
            y='0.5'
            width='39'
            height='39'
            rx='19.5'
            stroke='white'
            stroke-opacity='0.2'
          />
          <path
            d='M17.6444 14.7599C17.5342 14.7599 17.479 14.69 17.4607 14.5803C17.1483 12.9837 17.1666 12.9238 15.6231 12.5845C15.522 12.5646 15.4485 12.4947 15.4485 12.3849C15.4485 12.2652 15.522 12.1953 15.6231 12.1754C17.1666 11.8361 17.1483 11.7762 17.4607 10.1896C17.479 10.0798 17.5342 10 17.6444 10C17.7547 10 17.8098 10.0798 17.8282 10.1896C18.1406 11.7762 18.1222 11.8361 19.6658 12.1754C19.7669 12.1953 19.8404 12.2652 19.8404 12.3849C19.8404 12.4947 19.7669 12.5646 19.6658 12.5845C18.1222 12.9238 18.1406 12.9837 17.8282 14.5803C17.8098 14.69 17.7547 14.7599 17.6444 14.7599ZM25.2337 18.2824C25.1051 18.2824 25.0316 18.1926 25.004 18.0629C24.6916 16.1669 24.6824 16.0471 22.8356 15.6979C22.7162 15.6779 22.6243 15.5881 22.6243 15.4484C22.6243 15.3087 22.7162 15.2289 22.8356 15.199C24.6824 14.8597 24.6916 14.7399 25.004 12.844C25.0316 12.7142 25.1051 12.6144 25.2337 12.6144C25.3624 12.6144 25.4359 12.7142 25.4634 12.844C25.7758 14.7399 25.785 14.8597 27.6318 15.199C27.7604 15.2289 27.8431 15.3087 27.8431 15.4484C27.8431 15.5881 27.7604 15.6779 27.6318 15.6979C25.785 16.0471 25.7758 16.1669 25.4634 18.0629C25.4359 18.1926 25.3624 18.2824 25.2337 18.2824ZM12.6094 21.1463C12.4808 21.1463 12.4073 21.0465 12.3797 20.9168C12.0673 19.0208 12.0581 18.9011 10.2113 18.5618C10.0919 18.5319 10 18.452 10 18.3123C10 18.1726 10.0919 18.0828 10.2113 18.0629C12.0581 17.7136 12.0673 17.5939 12.3797 15.6979C12.4073 15.5682 12.4808 15.4784 12.6094 15.4784C12.738 15.4784 12.8115 15.5682 12.8391 15.6979C13.1515 17.5939 13.1607 17.7136 15.0075 18.0629C15.1269 18.0828 15.2188 18.1726 15.2188 18.3123C15.2188 18.452 15.1269 18.5319 15.0075 18.5618C13.1607 18.9011 13.1515 19.0208 12.8391 20.9168C12.8115 21.0465 12.738 21.1463 12.6094 21.1463ZM28.3025 29.6782L19.5647 20.1684C19.188 19.7493 19.1788 19.0607 19.5647 18.6217C19.9322 18.2026 20.5938 18.2026 20.9797 18.6217L29.7175 28.1414C30.0942 28.5606 30.0942 29.2391 29.7175 29.6782C29.3499 30.1073 28.6884 30.1073 28.3025 29.6782ZM16.9737 29.8378C16.7991 29.8378 16.6797 29.7081 16.6613 29.5385C16.3305 26.8741 16.257 26.8741 13.712 26.3453C13.5558 26.3054 13.4363 26.1956 13.4363 26.006C13.4363 25.8164 13.5558 25.6867 13.712 25.6667C16.257 25.2775 16.3397 25.1877 16.6613 22.4835C16.6797 22.3039 16.7991 22.1741 16.9737 22.1741C17.1391 22.1741 17.2585 22.3039 17.2861 22.4935C17.5801 25.1578 17.7179 25.1478 20.2354 25.6667C20.3916 25.6966 20.5111 25.8164 20.5111 26.006C20.5111 26.2056 20.3916 26.3054 20.1987 26.3453C17.6996 26.7843 17.5801 26.8542 17.2861 29.5185C17.2585 29.7081 17.1391 29.8378 16.9737 29.8378ZM28.6241 28.9896C28.7987 29.1792 28.9732 29.2092 29.1386 29.0595C29.2856 28.8799 29.2489 28.6803 29.0835 28.5107L23.4145 22.3438L22.9551 22.8228L28.6241 28.9896Z'
            fill='white'
          />
        </svg>

        <p className='text-2xl'>You have approved claim of tool ownership</p>

        <Card className='flex-row gap-4'>
          <img src='/icons/logo.svg' alt='Tool Image' width={80} height={80} />
          <div className='flex flex-col'>
            <p>{tool.name}</p>
            <p className='text-[#808080]'>{tool.full_description}</p>
            <div className='flex items-center gap-2'>
              {/* {tool.tool_tags.map(({ tag }: { tag: any }) => (
                <p className='text-[#007AFF] bg-white px-3 py-1 rounded-md'>
                  {tag.name}
                </p>
              ))} */}
            </div>
          </div>
        </Card>

        <p className='text-2xl'>For</p>

        <Card className='flex-col'>
          <div className='flex flex-col gap-5'>
            <div className='w-full flex'>
              <div className='flex flex-col gap-1 w-2/6'>
                <p className='text-[#CCCCCC]'>AVATAR</p>
                <img
                  src='/icons/logo.svg'
                  alt='User Image'
                  width={80}
                  height={80}
                />
              </div>

              <div className='flex flex-col gap-1 w-2/6'>
                <p className='text-[#CCCCCC]'>FIRST NAME</p>
                <p>John</p>
              </div>

              <div className='flex flex-col gap-1 w-2/6'>
                <p className='text-[#CCCCCC]'>LAST NAME</p>
                <p>Doe</p>
              </div>
            </div>

            <div className='w-full flex'>
              <div className='flex flex-col gap-1 w-2/6'>
                <p className='text-[#CCCCCC]'>USER ID</p>
                <p>ID12412</p>
              </div>

              <div className='flex flex-col gap-1 w-2/6'>
                {' '}
                <p className='text-[#CCCCCC]'>USERNAME</p>
                <p>john_doe</p>
              </div>

              <div className='flex flex-col gap-1 w-2/6'>
                <p className='text-[#CCCCCC]'>EMAIL</p>
                <p>john@example.com</p>
              </div>
            </div>
          </div>
        </Card>

        {/* BUTTONS */}
        <div className='flex items-center gap-3'>
          <div
            className='w-3/6 text-center border border-[#F2F2F2] rounded-md py-1 cursor-pointer'
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </div>
          <button
            type='submit'
            className='w-3/6 text-center bg-black text-white rounded-md py-1 cursor-pointer'
            onClick={() => onOpenChange(false)}
          >
            OKAY
          </button>
        </div>
      </div>
    </DialogContainer>
  );
};
