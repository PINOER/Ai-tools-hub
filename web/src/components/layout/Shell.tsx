"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useLoginMutation } from "@/hooks/queries/useLoginMutation";
import { useUser, useSession } from "@clerk/nextjs";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { SOCIAL_PROVIDERS } from "@/utils/constants";
import { LoginRequest } from "@/types";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { PusherProvider } from "@/contexts/PusherContext";

export default function Shell({ children }: { children: React.ReactNode }) {
  const { login } = useAuth();
  const loginMutation = useLoginMutation();
  const { user, isLoaded, isSignedIn } = useUser();
  const { session } = useSession();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const handleToggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  const handleLogin = async () => {
    const payload: LoginRequest = {
      first_name: user?.firstName || "",
      last_name: user?.lastName || "",
      provider:
        SOCIAL_PROVIDERS[
          session?.user?.externalAccounts?.[0]
            ?.provider as keyof typeof SOCIAL_PROVIDERS
        ] || "",
      providerId: user?.id || "",
    };

    if (user?.emailAddresses[0]?.emailAddress) {
      payload.email = user.emailAddresses[0].emailAddress;
    }

    if (payload?.provider === "Github") {
      payload.first_name = user?.firstName || user?.username || "";
    }

    const response = await loginMutation.mutateAsync(payload);
    // Handle different possible response formats
    let accessToken, refreshToken;
    if (response) {
      accessToken = response.accessToken;
      refreshToken = response.refreshToken || response.refresh_token;
    }
    // Check if we have at least the access token
    if (accessToken) {
      // Use the auth hook to set the authentication state
      login(accessToken, refreshToken || "");
    }
  };

  useEffect(() => {
    if (user) {
      handleLogin();
    }
  }, [user]);

  // Show loader while login is in progress
  if (
    isSignedIn &&
    (!isLoaded || loginMutation.isPending || loginMutation.status !== "success")
  ) {
    return (
      <>
        <div className="flex">
          <main
            className={`flex-1 w-[100%] h-screen mt-1 sm:mt-0 md:mt-0 bg-transparent p-8 transition-all duration-200 pt-28}`}
          >
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-600">Loading...</p>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <PusherProvider>
      <NotificationProvider>
        <Header
          onToggleSidebar={handleToggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
        />
        <div className="flex">
          <Sidebar collapsed={sidebarCollapsed} />
          <main
            className={`flex-1 w-[85%] h-screen mt-1 sm:mt-0 md:mt-0 bg-transparent p-8 transition-all duration-200 pt-28 md:pt-14 ${
              sidebarCollapsed ? "md:ml-20 ml-0" : "ml-0 md:ml-52"
            }`}
          >
            {children}
          </main>
        </div>
      </NotificationProvider>
    </PusherProvider>
  );
}
