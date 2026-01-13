import { FiX } from "react-icons/fi";
import Tabs from "../toolUi/Tabs";
import { useState } from "react";
import ToolClaim from "../toolClaim/ToolClaim";
import WhatNext from "../toolClaim/What'sNext";
import { useForm } from "react-hook-form";
import RegisterTool from "../registerTool/RegisterTool";
import { useToolClaimMutation } from "@/hooks/queries/useToolClaimMutation";

const tabs = ["Claim tool", "What's next"];

export default function ClaimModal({
  setShowModal,
  toolId,
}: {
  setShowModal: (show: boolean) => void;
  toolId: number;
}) {
  const [selectedTab, setSelectedTab] = useState("Claim tool");
  const [showRegister, setShowRegister] = useState(false);
  
  const claimMutation = useToolClaimMutation(toolId);

  const methods = useForm({
    mode: "onSubmit",
    shouldUnregister: false,
    defaultValues: {
      name: "",
      job: "",
      email: "",
      phoneNo: "",
      relation: "",
      websiteUrl: "",
      toolUrl: "",
      profile: "",
      information: "",
      companyId: []
    }
  });

  const onSubmit = async (data: any) => {
    try {
      await claimMutation.mutateAsync(data);
      setShowModal(false);
      setShowRegister(true)
    } catch (error) {
      console.error("Error claiming tool", error);
    }
  };

  return (
    <>
      {showRegister ? (
        <RegisterTool setShowRegister={setShowRegister} />
      ) : (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="relative w-full h-[90vh] max-w-4xl bg-white rounded-2xl shadow-xl overflow-y-auto">
            <div className="p-[20px]">
              <h1 className="font-sf-pro-rounded text-[27px] font-medium text-[#00000033]">
                Claim ownership of a tool
              </h1>
              <button
                onClick={() => setShowModal(false)}
                className="absolute cursor-pointer top-4 right-6 text-gray-400 hover:text-black transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
         
            <Tabs
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              options={tabs}
              tabClickable={true}
            />
            {selectedTab === "Claim tool" && (
              <ToolClaim
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                setShowModal={setShowModal}
                control={methods.control}
                errors={methods.formState.errors}
                watch={methods.watch}
                trigger={methods.trigger}
                handleSubmission={methods.handleSubmit(onSubmit)}
              />
            )}
            {selectedTab === "What's next" && (
              <WhatNext
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                setShowRegister={setShowRegister}
                handleSubmission={methods.handleSubmit(onSubmit)}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
