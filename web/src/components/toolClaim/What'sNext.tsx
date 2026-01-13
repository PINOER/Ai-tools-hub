import { BottomButtons } from "./ToolClaim";

export default function WhatNext({
  selectedTab,
  setSelectedTab,
  setShowRegister,
  handleSubmission,
}: {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  setShowRegister: (show: boolean) => void;
  handleSubmission: () => void;
}) {

  return (
    <>
      <div className="p-[20px] mt-[40px]">
        <div className="p-[40px] bg-[#F2F2F2] rounded-[10px]">
          <div>
            <p className="font-[inter] font-medium text-[20px]">
              {" "}
              📧 Email Verification
            </p>
            <p className="font-[inter] font-medium text-[15px] text-[#4D4D4D] mt-[8px]">
              We&apos;ll send a verification link to your company email address
            </p>
          </div>

          <div className="mt-[20px]">
            <p className="font-[inter] font-medium text-[20px]">
              {" "}
              ⏱️ Review Process (1-3 business days)
            </p>
            <p className="font-[inter] font-medium text-[15px] text-[#4D4D4D] mt-[8px]">
              Our team will verify your ownership claim and provided
              documentation
            </p>
          </div>

          <div className="mt-[20px]">
            <p className="font-[inter] font-medium text-[20px]">
              {" "}
              ✅ Approval Notification
            </p>
            <p className="font-[inter] font-medium text-[15px] text-[#4D4D4D] mt-[8px]">
              You&apos;ll receive email confirmation and gain access to manage
              your tool listing
            </p>
          </div>

          <div className="mt-[20px]">
            <p className="font-[inter] font-medium text-[20px]">
              {" "}
              🎯 Owner Benefits
            </p>
            <ul className="list-disc pl-6 font-[inter] font-medium text-[15px] text-[#4D4D4D] mt-[8px]">
              <li>Edit tool information</li>
              <li>Respond to user reviews</li>
              <li>Access analytics dashboard</li>
              <li>Promote updates and features</li>
              <li>Direct communication with users</li>
            </ul>
          </div>
        </div>
        <BottomButtons
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          setShowModal={() => {}}
          setShowRegister={setShowRegister}
          handleSubmission={handleSubmission}
        />
      </div>
    </>
  );
}
