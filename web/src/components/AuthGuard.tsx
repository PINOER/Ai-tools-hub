"use client";

import React from "react";
import { useUser, SignIn } from "@clerk/nextjs";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] p-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
          <p className="text-gray-600 mb-4">
            Please sign in with GitHub or Facebook to access this feature.
          </p>
        </div>
        
        {/* 👇 Only GitHub + Facebook will be shown */}
        <SignIn
          appearance={{
            elements: {
              card: "shadow-lg border border-gray-200",
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
              socialButtonsBlockButton: "border border-gray-300 hover:bg-gray-50",
              socialButtonsBlockButtonText: "text-gray-700 font-medium",
            },
          }}
        />
      </div>
    );
  }

  return <>{children}</>;
}
