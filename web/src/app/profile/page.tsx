"use client";
import BookMarks from "@/components/profileSections/bookmarks/BookMarks";
import Comments from "@/components/profileSections/comments/Comments";
import Newsletter from "@/components/profileSections/newsLetter/NewsLetter";
import Reviews from "@/components/profileSections/reviews/Reviews";
import Tools from "@/components/profileSections/tools/Tools";
import LoginModal from "@/components/modals/LoginModal";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/types/components";
import { useCurrentUserQuery } from "@/hooks/queries/useUserQuery";
import Tabs from "@/components/toolUi/Tabs";
import { useUser } from "@clerk/nextjs";

const tabs = ["Tools", "Reviews", "Comments", "BookMarks", "Newsletter"];

export default function Profile() {
  const [selectedTab, setSelectedTab] = useState("Tools");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { isSignedIn : isAuthenticated } = useUser();
  const router = useRouter();

  // Use React Query hook to fetch current user
  const {
    data: profile,
    isLoading: profileLoading,
    error,
  } = useCurrentUserQuery();

  useEffect(() => {

    // If not authenticated, show login modal
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    // If there's an error and it's a 401, show login modal
    if (error && (error as ApiError)?.response?.status === 401) {
      setShowLoginModal(true);
    }
  }, [isAuthenticated, error]);

  const handleCloseModal = () => {
    if (!isAuthenticated) {
      setIsRedirecting(true);
      setShowLoginModal(false);
      // Redirect to home page when modal is closed without logging in
      router.push("/");
    } else {
      // If user is now authenticated, close modal and let the useEffect handle profile loading
      setShowLoginModal(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="border border-[#F2F2F2] p-[40px] mt-[16px] shadow-[rgba(0, 0, 0, 0.04)] rounded-[15px]">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg">Loading profile...</div>
        </div>
      </div>
    );
  }

  // Show redirecting message if user is being redirected
  if (isRedirecting) {
    return (
      <div className="border border-[#F2F2F2] p-[40px] mt-[16px] shadow-[rgba(0, 0, 0, 0.04)] rounded-[15px]">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg">Redirecting...</div>
        </div>
      </div>
    );
  }

  // Show login modal if user is not authenticated
  if (showLoginModal) {
    return (
      <>
        <div className="border border-[#F2F2F2] p-[40px] mt-[16px] shadow-[rgba(0, 0, 0, 0.04)] rounded-[15px]">
          <div className="text-center py-12">
            <div className="mb-6">
              <Image
                src="/person-icon.svg"
                alt="profile"
                width={64}
                height={64}
                className="mx-auto opacity-30"
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Profile Access Restricted
            </h2>
            <p className="text-gray-500 mb-6">
              Please log in to view your profile and access your personal data.
            </p>
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login to Continue
            </button>
          </div>
        </div>
        <LoginModal isOpen={showLoginModal} onClose={handleCloseModal} />
      </>
    );
  }

  return (
    <div className="border border-[#F2F2F2] p-[40px] mt-[16px] shadow-[rgba(0, 0, 0, 0.04)] rounded-[15px]">
      <div className="flex justify-between flex-wrap mb-2">
        <div className="flex">
          <div className="w-[80px] h-[80px] border border-gray-200 rounded-[15px] overflow-hidden">
            <Image
              src={profile?.avatar || "/profile.svg"}
              alt="profile-pic"
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="ml-[20px] flex flex-col">
            <p className="font-[inter] font-medium text-[20px] text-[#000000]">
              {profile
                ? `${profile.first_name} ${profile.last_name}`
                : "Unknown User"}
            </p>
            <div className="flex items-center gap-2">
              <p className="font-medium text-[15px] text-[#CCCCCC]">
                {profile?.username || "username"}
              </p>
            </div>
          </div>
        </div>
        <button className="flex items-center cursor-pointer justify-evenly border border-[#F2F2F2] rounded-[10px] w-[120px] h-[35px] pl-[5px]">
          Edit profile{" "}
          <Image src="/edit.svg" alt="edit" width={16} height={16} />
        </button>
      </div>

      <div className="mt-[20px]">
        <p className="font-medium text-[12px] text-[#CCCCCC]">BIO</p>
        <p className="font-medium text-[15px] text-[#000000] font-[Inter] mt-[8px]">
          {profile?.bio || "No bio provided."}
        </p>
      </div>
      <div className="mt-[40px] ml-[-5px]">
      <Tabs options={tabs} selectedTab={selectedTab} setSelectedTab={setSelectedTab} tabClickable={true} />
      </div>
      {selectedTab === "Tools" && (
        <Tools
          tools={profile?.toolSubmissions ?? []}
          loading={profileLoading}
          isError={!!error}
        />
      )}
      {selectedTab === "Reviews" && (
        <Reviews reviews={profile?.reviews ?? []} loading={profileLoading} isError={!!error} />
      )}
      {selectedTab === "Comments" && <Comments comments={profile?.comments ?? []} loading={profileLoading} isError={!!error}/>}
      {selectedTab === "BookMarks" && <BookMarks />}
      {selectedTab === "Newsletter" && <Newsletter />}
    </div>
  );
}
