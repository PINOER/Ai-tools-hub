"use client";

import { useSignIn } from "@clerk/nextjs";
import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";

export default function CustomSignInModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { isLoaded, signIn } = useSignIn();

  if (!isOpen || !isLoaded) return null;

  const handleOAuthSignIn = (
    provider: "oauth_google" | "oauth_facebook" | "oauth_github"
  ) => {
    return signIn?.authenticateWithRedirect({
      strategy: provider,
      redirectUrl: "/sso-callback", // temporary page for Clerk
      redirectUrlComplete: "/", // where to send the user after login
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white md:w-[800px] md:h-[640px] w-[90vw] rounded-2xl shadow-xl p-6">
      <button
              onClick={onClose}
              className="top-4 right-10 float-right text-gray-400 hover:text-black cursor-pointer"
            >
              <FiX size={20} />
            </button>
        
        <div className="flex flex-col justify-center items-center h-full">  
        <div className="flex justify-center mb-6">
          <Image src="/hub.svg" alt="logo" width={148} height={140} />
        </div>

        <h2 className="text-[20px] font-medium font-[inter] text-center mb-[40px]">
          Discover and save the best AI tools for your workflow. <br />
          Read best curated AI content. <br />
          Join 50,000+ AI enthusiasts.
        </h2>

        <div className="flex justify-center items-center mb-[20px]">
          <button
            onClick={() => handleOAuthSignIn("oauth_google")}
            className="flex cursor-pointer items-center justify-center gap-2 bg-black text-white py-3 pr-[10px] pl-[15px] rounded-lg"
          >
            <span className="text-[15px] font-[SF Pro Rounded] font-medium">
              Signup with Google
            </span>
            <Image src="/google.svg" alt="Google" width={29} height={29} />
          </button>
        </div>

        <div className="flex justify-center items-center gap-3">
          <button
            onClick={() => handleOAuthSignIn("oauth_facebook")}
            className="flex cursor-pointer items-center justify-center gap-2 border border-[#F2F2F2] w-[64px] h-[64px]   rounded-[15px]"
          >
            <Image src="/Facebook.svg" alt="Facebook" width={32} height={32} />
          </button>

          <button
            onClick={() => handleOAuthSignIn("oauth_github")}
            className="flex cursor-pointer items-center justify-center gap-2 border border-[#F2F2F2] w-[64px] h-[64px]   rounded-[15px]"
          >
            <FaGithub size={32} />
            {/* <img src="/github.svg" alt="GitHub" className="w-5 h-5" /> */}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
