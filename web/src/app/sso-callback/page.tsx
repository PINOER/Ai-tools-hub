"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import Image from "next/image";

export default function SSOCallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <Image
            src="/hub.svg"
            alt="AI Tools Hub"
            width={120}
            height={120}
            className="animate-pulse"
          />
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Completing sign in...
        </h2>

        <p className="text-gray-600 mb-8">Please wait while we redirect you</p>

        <div className="flex justify-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
        </div>
      </div>

      {/* Clerk component that handles the OAuth callback */}
      <AuthenticateWithRedirectCallback />
    </div>
  );
}
