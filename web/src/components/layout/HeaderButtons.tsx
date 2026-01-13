"use client";
import { useState } from "react";
import { GoPlus } from "react-icons/go";
import Dropdown from "../DropDown";
import Image from "next/image";
import SubscribeModal from "../modals/SubscribeModal";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import CustomSignInModal from "../modals/LoginModal";
import NotificationsDropdown from "./NotificationsDropdown";

export default function HeaderButtons({
  handleCreateToolModal,
  showCreateButton = true,
}: {
  handleCreateToolModal: () => void;
  showCreateButton?: boolean;
}) {
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  const handleSubscribe = () => {
    setShowSubscribeModal(true);
  };

  const handleSignIn = () => {
    setShowSignInModal(true);
  };

  return (
    <>
      <div className="flex items-center gap-2 ml-auto">
        <SignedIn>
          {showCreateButton && (
            <button
              onClick={handleCreateToolModal}
              className="w-[32px] h-[32px] cursor-pointer rounded-[10px] border border-[#F2F2F2] hover:bg-gray-100 transition-colors"
            >
              <GoPlus className="w-[16px] h-[16px] ml-[7.5px]" />
            </button>
          )}
          <NotificationsDropdown />
          <Dropdown />
          {/* <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-8 h-8"
              }
            }}
          /> */}
        </SignedIn>

        <SignedOut>
          <button
            onClick={handleSubscribe}
            className="flex gap-1 py-[2px] px-[8px] border border-[#F2F2F2] rounded-[10px] font-semibold text-[15px] text-[#000000] hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Subscribe{" "}
            <Image src="/inbox.svg" alt="inbox" width={16} height={16} />
          </button>
          <button
            onClick={handleSignIn}
            className="flex gap-1 py-[2px] px-[8px] border border-[#F2F2F2] bg-black rounded-[10px] font-semibold text-[15px] text-[#FFFFFF] hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Sign in{" "}
            <Image
              src="/walk.svg"
              alt="walking-person"
              width={16}
              height={16}
            />
          </button>
        </SignedOut>
      </div>

      <SubscribeModal
        isOpen={showSubscribeModal}
        onClose={() => setShowSubscribeModal(false)}
      />

      <CustomSignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
      />
    </>
  );
}
