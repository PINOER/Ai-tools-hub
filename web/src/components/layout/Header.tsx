import React, { useState, Suspense } from "react";
import { dummyTags, HEADER_HEIGHT } from "@/utils/constants";
import Image from "next/image";
import { HeaderProps } from "@/types/components";
import { useIsMobile } from "@/hooks/useIsMobile";
import { navItems, socialLinks } from "./Sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import HeaderButtons from "./HeaderButtons";
import { CreateToolDialog } from "../tools/CreateToolDialog";
import { useCategoriesQuery } from "@/hooks/queries/useCategoriesQuery";
import SearchBar from "../SearchBar";

const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  sidebarCollapsed,
}) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [showCreateToolModal, setShowCreateToolModal] = useState(false);

  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategoriesQuery({
      section: "Tool",
      limit: 50,
    });
  const categories = categoriesData?.categories || [];
  const activeItem =
    navItems.find((item) => pathname === item.href) || navItems[0];

  const handleCreateToolModal = () => {
    setShowCreateToolModal((prev) => !prev);
  };

  const isHomePage = pathname === "/";

  return (
    <>
      <header
        className="flex items-center w-full bg-white fixed z-10 top-0 left-0 right-0
                 px-8 pt-4 sm:pt-0 md:pt-0 md:px-9"
        style={{
          height: isMobile ? "116px" : `${HEADER_HEIGHT}px`,
          minHeight: isMobile ? "116px" : `${HEADER_HEIGHT}px`,
        }}
      >
        {/* Logo & Collapse */}
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-2">
            <Image
              src="/tool_Icon.svg"
              alt="Tool Icon"
              width={34}
              height={40}
            />
            <span className="font-semibold text-[10px] inline text-black leading-3">
              AI <br /> Tools <br /> Hub
            </span>
          </div>

          {/* Collapse Icon - Hidden on mobile */}
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors focus:outline-none hidden md:block"
            aria-label="Toggle sidebar"
          >
            {sidebarCollapsed ? (
              <Image
                src="/Vector.svg"
                alt="Vector Icon"
                className="text-[#E5E5E5]"
                width={18}
                height={15}
              />
            ) : (
              <Image
                src="/header-collapse.svg"
                alt="collapse Icon"
                width={18}
                height={15}
              />
            )}
          </button>
        </div>

        {/* Search bar - Only visible on home page and hidden on mobile */}
        {isHomePage ? (
          <div className="flex-1 hidden md:flex md:justify-center">
            <Suspense fallback={<div className="w-full max-w-xs h-8" />}>
              <SearchBar placeholder="Search tools, news, articles..." />
            </Suspense>
          </div>
        ) : (
          <div className="flex-1 hidden md:block" />
        )}

        {/* Centered button for mobile */}
        <div className="flex-1 flex justify-center md:hidden">
          <button
            onClick={() => setIsOpen(true)}
            className={`flex items-center gap-2 h-[40px] w-[80px] pl-4 pr-2 py-1 rounded-[40px] text-white ${activeItem.selectedIconBg}`}
          >
            <Image
              src={activeItem.selectedIcon}
              alt={activeItem.label}
              width={20}
              height={20}
            />
            <div className="h-4 w-[1.5px] bg-white opacity-50" />
            <Image
              src="/carrot-icon.svg"
              alt="Dropdown"
              width={11}
              height={11}
            />
          </button>
        </div>

        {/* Right-side icons - Only show add button on home page */}
        <HeaderButtons
          handleCreateToolModal={handleCreateToolModal}
          showCreateButton={isHomePage}
        />

        {isOpen && (
          <div className="fixed inset-0 z-50 bg-white flex flex-col items-center pt-15">
            {/* Close button - positioned absolutely in top right */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <Image
                src="/cancel-icon.svg"
                alt="Close"
                width={20}
                height={20}
              />
            </button>

            {/* Header with Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center">
                <Image
                  src="/tool_Icon.svg"
                  alt="Tool Icon"
                  width={0}
                  height={0}
                  style={{ width: "80px", height: "70px" }}
                />
                <span className="font-semibold text-[15px] text-black leading-3">
                  AI <br /> Tools <br /> Hub
                </span>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="flex flex-col gap-4 items-center">
              {navItems.map(({ label, href, selectedIcon, selectedIconBg }) => {
                const bgClass = selectedIconBg;
                const iconSrc = selectedIcon;

                return (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 h-[40px] w-[122px] px-4 py-2 rounded-full text-sm no-underline ${bgClass}`}
                  >
                    <Image src={iconSrc} alt={label} width={20} height={20} />
                    <span className="text-white">{label}</span>
                  </Link>
                );
              })}
            </div>
            <div className="absolute bottom-15 flex flex-col gap-2 mt-8 w-full ml-1">
              <div className="flex gap-3 justify-center mb-2">
                {socialLinks.map(({ label, src, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center border border-[#F2F2F2] rounded-[10px] py-[6px] px-[8px] hover:bg-gray-100 transition-colors"
                    aria-label={label}
                  >
                    <Image src={src} alt={label} width={25} height={18} />
                  </a>
                ))}
              </div>
              <div className="flex justify-center gap-4 text-[15px] text-gray-500">
                <a href="#" className="hover:underline">
                  About us
                </a>
                <a href="#" className="hover:underline">
                  Contact
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
      {showCreateToolModal && (
        <CreateToolDialog
          open={showCreateToolModal}
          onOpenChange={setShowCreateToolModal}
          categories={categoriesLoading ? [] : categories}
          tags={dummyTags}
        />
      )}
    </>
  );
};

export default Header;
