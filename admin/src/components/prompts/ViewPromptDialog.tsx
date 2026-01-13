import DialogContainer from "../DialogContainer";
import { useState } from "react";
import type { Prompt } from "@/types/prompt";
import OptionsIcon from "@/components/icons/Options.svg";
import SaveIcon from "@/components/icons/Save.svg";
import ShareIcon from "@/components/icons/Share.svg";
import CommentIcon from "@/components/icons/Comment.svg";
import { PersonIcon } from "../icons";

interface ViewPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: Prompt | null;
  openEditModal: () => void;
}

const ViewPromptDialog = ({
  open,
  onOpenChange,
  prompt,
  openEditModal,
}: ViewPromptDialogProps) => {
  const [activeTab, setActiveTab] = useState<"details" | "analytics">(
    "details"
  );
  if (!prompt) return null;

  // Use only prompt.name and prompt.owner, fallback to dummy values for the rest
  const tags = prompt.tags ? prompt.tags.split(",") : [];
  const author = prompt.user?.first_name + " " + prompt.user?.last_name || "Dr. Research Expert";
  const date = prompt.published_date;
  const shortDescription = prompt.short_description;
  const mainPrompt = prompt.main_prompt;

  return (
    <DialogContainer
      title={null}
      open={open}
      onOpenChange={onOpenChange}
      maxWidth="4xl"
    >
      <div className="flex flex-col gap-6 p-2">
        <div className="flex justify-between items-center">
          {/* Tabs */}
          <div className="flex gap-2 mb-2">
            <button
              className={`px-2 py-1 text-xs rounded-lg cursor-pointer ${
                activeTab === "details"
                  ? "bg-[#4D4D4D] text-white"
                  : "border border-[#F2F2F2] bg-[#FFFFFF] text-[#4D4D4D]"
              }`}
              onClick={() => setActiveTab("details")}
            >
              Prompt details
            </button>
            <button
              className={`px-2 py-1 text-xs rounded-lg cursor-pointer ${
                activeTab === "analytics"
                  ? "bg-[#4D4D4D] text-white"
                  : "border border-[#F2F2F2] bg-[#FFFFFF] text-[#4D4D4D]"
              }`}
              onClick={() => setActiveTab("analytics")}
            >
              Prompt analytics
            </button>
          </div>
          <div className="flex gap-2 items-center justify-end">
            <img src={OptionsIcon} alt="Options Icon" />
            <button
              className="bg-[#000000] rounded-lg px-3 py-1.5 text-xs flex items-center text-white gap-2"
              onClick={openEditModal}
            >
              Edit
              <img src="/icons/edit.svg" alt="Edit" width={12} height={12} />
            </button>
            <button className="ml-2" onClick={() => onOpenChange(false)}>
              <span className="text-2xl text-[#888]">&times;</span>
            </button>
          </div>
        </div>

        {activeTab === "details" ? (
          <>
            <div className="flex flex-col items-start justify-between gap-4">
              <span className="text-4xl">🔍</span>
              <div>
                <div className="text-[25px] font-normal mb-1">
                  {prompt.title}
                </div>
                
                
                {tags.length > 0 && (
                  <div className="flex gap-2 mb-2">
                    {tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="text-xs text-[#34B1C8] border border-[#F2F2F2] bg-white px-2 py-1 rounded-lg"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {prompt?.ai_models?.length > 0 && (
                  <div className="flex gap-2 mb-2">
                    {prompt?.ai_models?.map((model: string) => (
                      <span
                        key={model}
                        className="text-[12px] border border-[#F2F2F2] px-2 py-1 rounded-lg text-[#4D4D4D] bg-white"
                      >
                        {model}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-4 text-sm text-[#808080] items-center">
                  <span>{date}</span>
                  <div className="flex justify-center items-center gap-4">
                    <PersonIcon width={11} height={11} color="#808080" />
                    <span className="-ml-3">{author}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full flex justify-end items-center gap-2">
              <img src={CommentIcon} alt="Comment Icon" />
              <img src={ShareIcon} alt="Share Icon" />
              <img src={SaveIcon} alt="Saved Icon" />
            </div>
            <div>
              <div className="text-[15px] text-[#00000033] font-medium mb-3">
                SHORT DESCRIPTION
              </div>
              <div
                className="mb-4 text-[#222] text-sm"
                dangerouslySetInnerHTML={{ __html: shortDescription }}
              />
            </div>
            <div>
              <div className="text-[15px] text-[#00000033] font-medium mb-3">
                MAIN PROMPT
              </div>
              <div
                className="bg-[#FFFFFF] border border-[#F2F2F2] rounded-lg p-8 text-sm whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: mainPrompt }}
              ></div>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-80 text-[#808080] text-[15px] border border-[#F2F2F2] rounded-lg">
            Google Analytics will be displayed here.
          </div>
        )}
      </div>
    </DialogContainer>
  );
};

export default ViewPromptDialog;
