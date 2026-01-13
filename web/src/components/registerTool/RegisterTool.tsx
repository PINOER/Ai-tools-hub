import Image from "next/image";
import { FiX } from "react-icons/fi";
import CustomSignInModal from "../modals/LoginModal";
import { useState } from "react";

export default function RegisterTool({
  setShowRegister,
}: {
  setShowRegister: (show: boolean) => void;
}) {
  const [showSignInModal, setShowSignInModal] = useState(false);

  const handleSignIn = () => {
      setShowSignInModal(true);
    };
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="relative w-full h-[40vh] max-w-2xl bg-white rounded-2xl shadow-xl overflow-y-auto  py-[20px] px-[40px]">
        <p className="text-[27px] font-sf-pro-rounded font-medium text-[#CCCCCC]">
          Claim tool
        </p>
        <button
          onClick={() => setShowRegister(false)}
          className="absolute cursor-pointer top-4 right-6 text-gray-400 hover:text-black transition-colors"
        >
          <FiX size={20} />
        </button>

        <div className="flex items-center gap-2 mt-[40px]">
          <Image src="/walk.svg" alt="close" width={32} height={32} />
          <Image
            src="/magic-selected-icon.svg"
            alt="close"
            width={32}
            height={32}
            className="bg-[#007AFF] rounded-full p-1"
          />
        </div>

        <p className="font-[inter] font-medium text-[20px] mt-[40px]">
          To claim this tool you must register
        </p>
        <div className="mt-[40px]">
          <div className="mt-[20px] flex gap-4">
            <button
              onClick={() => setShowRegister(false)}
              className="cursor-pointer border border-[#F2F2F2] w-1/2 rounded-md py-1 px-4"
            >
              Cancel
            </button>
            <button onClick={handleSignIn} className="cursor-pointer border border-[#F2F2F2] bg-black text-white w-1/2 rounded-md py-1 px-4">
              Register
            </button>
          </div>
        </div>
      </div>
      <CustomSignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
      />
    </div>
  );
}
