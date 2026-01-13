"use client";
import Image from "next/image";
import { useState } from "react";
import Tabs from "@/components/toolUi/Tabs";
import General from "@/components/settingsSection/General";
import AccountSettings from "@/components/settingsSection/AccountSettings";

const tabs = ["General", "Account settings"];

export default function Settings() {
    const [selectedTab, setSelectedTab] = useState("General");

    return (
        <div className="border border-[#F2F2F2] rounded-[15px] box-shadow-[#0000000A] p-[40px] mt-[10px]">
            <div className="flex gap-2">
              <Image src="/setting.svg" alt="setting" width={32} height={32} />
              <h1 className="text-[25px] font-medium font-[inter] text-[#808080]">Settings</h1>
              <div className="flex flex-col justify-center flex-1 ml-2 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-full"
                  style={{
                    height: "1px",
                    background: `linear-gradient(to right, #808080, #FFFFFF00, transparent)`,
                    transform: "scaleY(0.9)",
                    transformOrigin: "top", // Ensure scaling happens from the top
                  }}
                />
              ))}
            </div>
            </div>

            <div className="flex gap-2 my-[40px] ml-[-23px]">
              <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} options={tabs} tabClickable={true} />
            </div>
            {
                selectedTab === "General" && (
                   <General />
                )
            }
            {
                selectedTab === "Account settings" && (
                    <AccountSettings />
                )
            }
        </div>
    )
}