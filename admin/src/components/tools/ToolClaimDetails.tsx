import { ToolsStatus, type Tools } from '@/types/tools';
import DialogContainer from '@/components/DialogContainer';
import Card from '@/components/Card';

interface ToolClaimDialogProps {
  tool: Tools | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  approveClaim: (id: number) => void;
}

export const ToolClaimDetailsDialog = ({
  tool,
  open,
  onOpenChange,
  approveClaim,
}: ToolClaimDialogProps) => {
  if (!tool) return null;

  const isApproved = tool.status === ToolsStatus.Approved;
  
  return (
    <DialogContainer
      title='Tool claim'
      open={open}
      onOpenChange={onOpenChange}
      maxWidth='3xl'
    >
      <div className='p-6'>
      <Card >
        <p className='text-[#00000033] text-[15px] font-[inter] font-medium'>CLAIM INFORMATION</p>

        <div className='flex gap-1'>
          <div className='w-3/6'>
            <p className='text-[#CCCCCC] text-[12px] font-[inter] font-medium'>CLAIM ID</p>
            <p className='text-[15px] font-[inter] font-medium'>{tool.id}</p>
          </div>
          <div className='w-3/6'>
            <p className='text-[#CCCCCC] text-[12px] font-[inter] font-medium'>SUBMITTED</p>
            <p className='text-[15px] font-[inter] font-medium'>May 22, 2025 at 2:14 PM</p>
          </div>
        </div>

        <div className='flex gap-1'>
          <div className='flex flex-col w-3/6'>
            <p className='text-[#CCCCCC] text-[12px] font-[inter] font-medium'>TOOL</p>
            <div className='flex gap-4'>
              <img
                src={tool.avatar || '/icons/logo.svg'}
                alt={`${tool.name} logo`}
                className='w-20 h-20 object-cover rounded'
              />
              <div className='flex flex-col gap-2'>
                <p className='text-[20px] font-[inter] font-medium'>{tool.name}</p>
                <div className='flex items-center gap-3 text-sm'>
                  {tool.tool_tags && tool.tool_tags.length > 0 ? (
                    tool.tool_tags.map(({ tag }, index) => (
                      <p key={tag.id || index} className='text-black bg-white px-3 py-1 rounded-md'>
                        {tag.name}
                      </p>
                    ))
                  ) : (
                    <p className='text-gray-500 text-sm'>No tags available</p>
                  )}
                </div>
                <p className='flex gap-1 items-center justify-center text-center bg-white rounded-lg'>
                  <span>
                    <svg
                      width='15'
                      height='13'
                      viewBox='0 0 13 12'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M2.64842 11.5159C2.38737 11.3329 2.33183 11.0297 2.4818 10.6167L3.62597 7.42236L0.71 5.4514C0.332312 5.20045 0.176794 4.92337 0.282324 4.6306C0.387855 4.34306 0.676674 4.2019 1.13767 4.20713L4.71459 4.22804L5.80322 1.01805C5.94763 0.599804 6.17535 0.375 6.4975 0.375C6.8252 0.375 7.05292 0.599804 7.19178 1.01805L8.2804 4.22804L11.8573 4.20713C12.3183 4.2019 12.6127 4.34306 12.7182 4.6306C12.8238 4.92337 12.6627 5.20045 12.2906 5.4514L9.37459 7.42236L10.5132 10.6167C10.6632 11.0297 10.6076 11.3329 10.3521 11.5159C10.0911 11.7041 9.76338 11.6414 9.38569 11.3852L6.4975 9.38809L3.6093 11.3852C3.23162 11.6414 2.90947 11.7041 2.64842 11.5159Z'
                        fill='#808080'
                      />
                    </svg>
                  </span>{' '}
                  <p className='text-[#808080] mt-0.5 text-[12px] font-[inter] font-medium'>240</p>
                </p>
              </div>
            </div>
          </div>
          <div className='w-3/6'>
            <p className='text-[#CCCCCC] text-[12px] font-[inter] font-medium'>STATUS</p>
            {tool.status === ToolsStatus.Pending ? (
              <p className='bg-[#34C75933] rounded-2xl p-1 w-2/6 text-center text-[#34C759]'>
                Active
              </p>
            ) : (
              <p className='bg-[#FFCC00] rounded-xl text-sm p-0.5 px-1.5 w-fit text-center'>
                {tool.status}
              </p>
            )}
          </div>
        </div>
      </Card>

      <Card className='gap-4'>
        <p className='text-[#00000033] text-[15px] font-[inter] font-medium'>CLAIMANT DETAILS</p>
        <div className='flex flex-col gap-1'>
          <p className='text-[#CCCCCC] text-[12px] font-[inter] font-medium'>USER DETAILS</p>
          <div className='flex items-center justify-between bg-white px-2 rounded-md'>
            <p className='text-[15px] font-[inter] font-medium'>john-doe</p>
          </div>
        </div>

        <div className='flex gap-1'>
          <div className='flex flex-col gap-1 w-3/6'>
            <p className='text-[#CCCCCC] text-[12px] font-[inter] font-medium'>FULL NAME</p>
            <p className='text-[15px] font-[inter] font-medium'>John Doe</p>
          </div>
          <div className='flex flex-col gap-1 w-3/6'>
            <p className='text-[#CCCCCC] text-[12px] font-[inter] font-medium'>COMPANY NAME</p>
            <p className='text-[15px] font-[inter] font-medium'>AI Tool Company</p>
          </div>
        </div>

        <div className='flex gap-1'>
          <div className='flex flex-col gap-1 w-3/6'>
            <p className='text-[#CCCCCC] text-[12px] font-[inter] font-medium'>COMPANY EMAIL</p>
            <p className='text-[15px] font-[inter] font-medium'>JOHN@EXAMPLE.COM</p>
          </div>
          <div className='flex flex-col gap-1 w-3/6'>
            <p className='text-[#CCCCCC] text-[12px] font-[inter] font-medium'>PHONE NUMBER</p>
            <p className='text-[15px] font-[inter] font-medium'>+10323442222</p>
          </div>
        </div>
      </Card>

      <Card className='gap-4'>
        <p className='text-[#00000033] text-[15px] font-[inter] font-medium'>VERIFICATION DETAILS</p>

        <div className='flex gap-1'>
          <div className='flex flex-col gap-1'>
            <p className='text-[#CCCCCC] text-[12px] font-[inter] font-medium'>RELATIONSHIP TO TOOL</p>
            <p className='text-[15px] font-[inter] font-medium'>Ceo of the company</p>
          </div>
        </div>

        <div className='flex gap-1'>
          <div className='flex flex-col gap-1 w-3/6'>
            <p className='text-[#CCCCCC] text-[12px] font-[inter] font-medium'>COMPANY WEBSITE URL</p>
            <p className='text-[15px] font-[inter] font-medium'>aitool.com</p>
          </div>
          <div className='flex flex-col gap-1 w-3/6'>
            <p className='text-[#CCCCCC] text-[12px] font-[inter] font-medium'>TOOL WEBSITE URL</p>
            <p className='text-[15px] font-[inter] font-medium'>+10323442222</p>
          </div>
        </div>
      </Card>

      <Card className='gap-4'>
        <p className='text-[#00000033] text-[15px] font-[inter] font-medium'>PROOF OF OWNERSHIP</p>

        <div className='flex gap-1'>
          <div className='flex flex-col gap-1'>
            <p className='text-[#CCCCCC] text-[12px] font-[inter] font-medium'>COMPANY ID/BUSINESS CARD</p>
            <svg
              width='40'
              height='40'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className='bg-[#E5E5E5] p-2 rounded-md cursor-pointer'
            >
              <path
                d='M7.03207 22C6.03071 22 5.27502 21.7444 4.76501 21.2333C4.255 20.7221 4 19.9677 4 18.97V5.03002C4 4.03849 4.255 3.28714 4.76501 2.77598C5.27502 2.25866 6.03071 2 7.03207 2H11.2863V8.98383C11.2863 10.1293 11.8647 10.7021 13.0216 10.7021H20V18.97C20 19.9615 19.745 20.7129 19.235 21.224C18.725 21.7413 17.9693 22 16.9679 22H7.03207ZM13.1895 9.35335C12.835 9.35335 12.6577 9.17783 12.6577 8.82679V2.09238C12.8692 2.11701 13.0807 2.20323 13.2921 2.35104C13.5098 2.49885 13.7337 2.68976 13.9638 2.92379L19.0577 8.04157C19.3003 8.28791 19.4931 8.51578 19.6362 8.72517C19.7854 8.93457 19.8725 9.14396 19.8974 9.35335H13.1895Z'
                fill='#4D4D4D'
              />
            </svg>
          </div>
        </div>

        <div className='flex gap-1'>
          <div className='flex flex-col gap-1'>
            <p className='text-[#CCCCCC] text-[12px] font-[inter] font-medium'>
              PROFESSIONAL PROFILE (LINKEDIN, GITHUB, ETC.)
            </p>
            <p className='text-[15px] font-[inter] font-medium'>linked.com/12121</p>
          </div>
        </div>
      </Card>

      <Card className='gap-4'>
        <p className='text-[#00000033] text-[15px] font-[inter] font-medium'>ADDITIONAL INFORMATION</p>

        <div className='flex gap-1'>
          <div className='flex flex-col gap-1'>
            <p className='text-[#CCCCCC] text-[12px] font-[inter] font-medium'>WHY ARE YOU CLAIMING THIS TOOL?*</p>
            <p className='text-[15px] font-[inter] font-medium'>I am the Ceo of the company</p>
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
          className={`w-3/6 text-center rounded-md py-1 cursor-pointer ${
            isApproved 
              ? 'text-gray-400 cursor-not-allowed bg-gray-100 border border-gray-300' 
              : 'bg-black text-white hover:bg-gray-800'
          }`}
          onClick={() => {
            if (!isApproved) {
              approveClaim(tool.id);
              onOpenChange(false);
            }
          }}
          disabled={isApproved}
        >
          Approve claim
        </button>
      </div>
      </div>
    </DialogContainer>
  );
};
