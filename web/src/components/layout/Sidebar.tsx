"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HEADER_HEIGHT } from "@/utils/constants";
import { SidebarNavItem, SidebarProps } from "@/types/components";
import Image from "next/image";

export const navItems: SidebarNavItem[] = [
  {
    label: "Home",
    icon: "/home-icon.svg",
    selectedIcon: "/home-selected.svg",
    href: "/",
    iconBg: "bg-gray-200 text-gray-500",
    selectedIconBg: "bg-[#4D4D4D] text-white",
  },
  {
    label: "Ai tools",
    icon: "/magic-icon.svg",
    selectedIcon: "/magic-selected-icon.svg",
    href: "/ai-tools",
    iconBg: "bg-gray-200 text-blue-500",
    selectedIconBg: "bg-[#007AFF] text-white",
  },
  {
    label: "News",
    icon: "/news-icon.svg",
    selectedIcon: "/selected-news-icon.svg",
    href: "/news",
    iconBg: "bg-gray-200 text-green-500",
    selectedIconBg: "bg-[#34C759] text-white",
  },
  {
    label: "Articles",
    icon: "/article-icon.svg",
    selectedIcon: "/selected-article-icon.svg",
    href: "/articles",
    iconBg: "bg-gray-200 text-cyan-500",
    selectedIconBg: "bg-[#00C7BE] text-white",
  },
  {
    label: "Learning",
    icon: "/learning-icon.svg",
    selectedIcon: "/selected-learning-icon.svg",
    href: "/learning",
    iconBg: "bg-gray-200 text-violet-500",
    selectedIconBg: "bg-[#5856D6] text-white",
  },
  {
    label: "Prompts",
    icon: "/prompts-icon.svg",
    selectedIcon: "/selected-prompts-icon.svg",
    href: "/prompts",
    iconBg: "bg-gray-200 text-teal-500",
    selectedIconBg: "bg-[#30B0C7] text-white",
  },
  {
    label: "Glossary",
    icon: "/glossary-icon.svg",
    selectedIcon: "/selected-glossary-icon.svg",
    href: "/glossary",
    iconBg: "bg-gray-200 text-rose-500",
    selectedIconBg: "bg-[#FF2D55] text-white",
  },
];

export const socialLinks = [
  { label: "Instagram", src: "/insta.svg", href: "https://instagram.com" },
  { label: "X", src: "/x2.svg", href: "https://x.com" },
  { label: "LinkedIn", src: "/linked.svg", href: "https://linkedin.com" },
];

const Sidebar: React.FC<SidebarProps> = ({
  bg = "bg-white",
  collapsed = false,
}) => {
  const pathname = usePathname();

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <aside
      className={`pb-24 flex-col justify-between hidden md:block h-screen ${bg} ${
        collapsed ? "w-26" : "w-24 md:w-52"
      } ${bg} py-6 px-2 md:px-4 fixed transition-all duration-200`}
      style={{ marginTop: HEADER_HEIGHT }}
    >
      <nav className="flex flex-col gap-2">
        {navItems.map(
          ({ label, icon, selectedIcon, href, iconBg, selectedIconBg }) => {
            // Special handling for home route - exact match only
            // For other routes, match if pathname starts with href
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            const isHovered = hoveredItem === label;

            return (
              <Link
                href={href}
                key={label}
                onMouseEnter={() => setHoveredItem(label)}
                onMouseLeave={() => setHoveredItem(null)}
                className="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-gray-700 font-medium"
              >
                <span
                  className={`flex items-center justify-center w-[40px] h-[40px] rounded-full 
          ${isHovered || isActive ? selectedIconBg : iconBg}`}
                >
                  <Image
                    src={isHovered || isActive ? selectedIcon : icon}
                    alt={label}
                    width={label === "Home" ? 22 : 24}
                    height={label === "Home" ? 22 : 24}
                  />
                </span>

                <span
                  className={`font-[Nunito] text-[15px] font-bold 
          ${collapsed ? "hidden" : "hidden md:inline"} 
          ${isHovered || isActive ? "text-black" : "text-[#808080]"}`}
                >
                  {label}
                </span>
              </Link>
            );
          }
        )}
      </nav>
      <div className="absolute bottom-20 flex flex-col gap-2 mt-8 w-full ml-[-16px]">
        {!collapsed && (
          <div className="flex gap-3 justify-center mb-2">
            {socialLinks.map(({ label, src, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center py-[6px] px-[8px] rounded-xl border border-gray-200 bg-white hover:bg-gray-100 transition-colors "
                aria-label={label}
              >
                <Image src={src} alt={label} width={18} height={18} />
              </a>
            ))}
          </div>
        )}
        {!collapsed && (
          <div className="flex justify-center gap-4 text-[12px] text-gray-500">
            <a href="#" className="hover:underline">
              About us
            </a>
            <a href="#" className="hover:underline">
              Contact
            </a>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
