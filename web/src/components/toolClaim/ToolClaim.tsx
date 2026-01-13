import { useState, useRef } from "react";
import { Input } from "../toolUi/input";
import ReactSelect from "react-select";
import { useParams } from "next/navigation";
import { useToolClaimMutation } from "@/hooks/queries/useToolClaimMutation";
import RegisterTool from "../registerTool/RegisterTool";
import { Controller, Control, FieldErrors, UseFormWatch, UseFormTrigger } from 'react-hook-form';
import Image from 'next/image';

interface BottomButtonsProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  setShowModal: (show: boolean) => void;
  setShowRegister?: (registerTool: boolean) => void;
  toolMutation?: any;
  handleSubmission: () => void; 
  onValidate?: () => Promise<boolean>;
  input?: {name : string, job : string, email : string, phoneNo : string, websiteUrl : string, toolUrl : string, profile : string, relation : string, information : string }
}

export const BottomButtons = ({
  selectedTab,
  setSelectedTab,
  setShowModal,
  handleSubmission,
  onValidate,
}: BottomButtonsProps) => {
  const [localShowRegister, setLocalShowRegister] = useState(false);

  const handleBackClick = () => {
    if (selectedTab === "What's next") {
      setSelectedTab("Claim tool");
      return;
    }
    setShowModal(false);
  };

  const handleNextClick = async () => {
    if (selectedTab === "Claim tool") {
      if (onValidate) {
         const isValid = await onValidate();
         if (isValid) {
          setSelectedTab("What's next");
         }
      }
    }
  };

  return (
    <div className="mt-[20px] flex gap-4">
      <button
        onClick={handleBackClick}
        className="cursor-pointer border border-[#F2F2F2] w-1/2 rounded-md py-1 px-4"
      >
        {selectedTab === "Claim tool" ? "Cancel" : "Back"}
      </button>
      <button
        onClick={selectedTab === "Claim tool" ? handleNextClick : handleSubmission}
        className="cursor-pointer border border-[#F2F2F2] bg-black text-white w-1/2 rounded-md py-1 px-4"
      >
        {selectedTab === "Claim tool" ? "Next" : "Claim tool"}
      </button>
      {localShowRegister && (
        <RegisterTool setShowRegister={setLocalShowRegister} />
      )}
    </div>
  );
};

// Validation regex patterns
const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+[1-9]\d{9,14}$/,
  url: /^https?:\/\/.+/,
};

export default function ToolClaim({
  selectedTab,
  setSelectedTab,
  setShowModal,
  control,
  errors,
  watch,
  trigger,
  handleSubmission,
}: {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  setShowModal: (show: boolean) => void;
  control: Control<any>;
  errors: FieldErrors<any>;
  watch: UseFormWatch<any>;
  trigger: UseFormTrigger<any>;
  handleSubmission: () => void;   
}) {
  const params = useParams();
  const id = parseInt(params.id as string);
  const toolMutation = useToolClaimMutation(id);
  const fileImageInputRef = useRef<HTMLInputElement>(null);

  const watchedValues = watch();

  const handleScreenshotsDivClick = () => {
    fileImageInputRef.current?.click();
  };

  const handleScreenshotsChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const files = e.target.files;
    if (!files) return;
    
    const fileArray = Array.from(files);
    const currentScreenshots = field.value || [];
    
    // Add files to the form state for preview (no upload yet)
    field.onChange([...currentScreenshots, ...fileArray]);
  };

  const validateForm = async () => {
    const isValid = await trigger();
    return isValid;
  };

  return (
    <>
      <div className="p-[20px] mt-[30px]">
        <div className="py-[8px] pl-[12px] pr-0 w-[95%] bg-[#F2F2F2] rounded-[10px]">
          <p className="text-[15px] font-medium font-[inter] text-[#4D4D4D]">
            Verify your ownership to manage this tool&apos;s listing, respond to
            reviews, and keep information up-to-date.
          </p>
        </div>
        <div className="border border-[#0000000D] mt-[40px]" />

        <div className="mt-[20px]">
          <p className="uppercase font-medium font-[inter] text-[14px] text-[#808080]">
            contact information
          </p>

          <div className="mt-[20px]">
            <p className="uppercase font-Nunito font-semibold text-[14px] text-[#4D4D4D]  mb-[6px]">
              full name *
            </p>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Full name is required" }}
              render={({ field }) => (
                <Input
                  placeholder="Type"
                  {...field}
                />
              )}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{String(errors.name.message)}</p>}
          </div>

          <div className="mt-[20px]">
            <p className="uppercase font-Nunito font-semibold text-[14px] text-[#4D4D4D]  mb-[6px]">
              Job Title/Position *
            </p>
            <Controller
              name="job"
              control={control}
              rules={{ required: "Job title is required" }}
              render={({ field }) => (
                <Input
                  placeholder="Type"
                  {...field}
                />
              )}
            />
            {errors.job && <p className="text-red-500 text-sm mt-1">{String(errors.job.message)}</p>}
          </div>

          <div className="mt-[20px]">
            <p className="uppercase font-Nunito font-semibold text-[14px] text-[#4D4D4D]  mb-[6px]">
              Company Email *
            </p>
            <Controller
              name="email"
              control={control}
              rules={{ 
                required: "Email is required",
                pattern: {
                  value: validationPatterns.email,
                  message: "Please enter a valid email address"
                }
              }}
              render={({ field }) => (
                <Input
                  placeholder="example@company.com"
                  {...field}
                />
              )}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{String(errors.email.message)}</p>}
          </div>

          <div className="mt-[20px]">
            <p className="uppercase font-Nunito font-semibold text-[14px] text-[#4D4D4D]  mb-[6px]">
              phone number *
            </p>
            <Controller
              name="phoneNo"
              control={control}
              rules={{ 
                required: "Phone number is required",
                validate: (value) => {
                  if (!value) return "Phone number is required";
                  if (!validationPatterns.phone.test(value)) {
                    return "Please enter a valid international phone number (e.g., +1234567890)";
                  }
                  return true;
                }
              }}
              render={({ field }) => (
                <Input
                  placeholder="+1234567890"
                  {...field}
                />
              )}
            />
            {errors.phoneNo && <p className="text-red-500 text-sm mt-1">{String(errors.phoneNo.message)}</p>}
          </div>

          <p className="uppercase font-medium font-[inter] text-[14px] text-[#808080] mt-[20px] mb-[20px]">
            contact information
          </p>

          <div className="mt-[20px]">
            <p className="uppercase font-Nunito font-semibold text-[14px] text-[#4D4D4D]  mb-[6px]">
              Relationship to Tool *
            </p>
            <Controller
              name="relation"
              control={control}
              rules={{ required: "Please select your relationship to the tool" }}
              render={({ field }) => (
                <ReactSelect
                  placeholder="Select"
                  {...field}
                  options={[
                    { value: "Creator", label: "Creator" },
                    { value: "CEO", label: "CEO" },
                    { value: "MarketingManager", label: "Marketing Manager" },
                  ] as { value: string; label: string }[]}
                  styles={{
                    indicatorSeparator: () => ({
                      display: "none",
                    }),
                  }}
                />
              )}
            />
            {errors.relation && <p className="text-red-500 text-sm mt-1">{String(errors.relation.message)}</p>}
          </div>

          <div className="mt-[20px] flex gap-4 w-full">
            <div className="w-1/2">
              <p className="uppercase font-Nunito font-semibold text-[14px] text-[#4D4D4D]  mb-[6px]">
                Company Website URL *
              </p>
              <Controller
                name="websiteUrl"
                control={control}
                rules={{ 
                  required: "Company website URL is required",
                  pattern: {
                    value: validationPatterns.url,
                    message: "Please enter a valid URL (e.g., https://company.com)"
                  }
                }}
                render={({ field }) => (
                  <Input placeholder="https://company.com" {...field} />
                )}
              />
              {errors.websiteUrl && <p className="text-red-500 text-sm mt-1">{String(errors.websiteUrl.message)}</p>}
            </div>
            <div className="w-1/2">
              <p className="uppercase font-Nunito font-semibold text-[14px] text-[#4D4D4D]  mb-[6px]">
                Tool Website URL: (if different from above)
              </p>
              <Controller
                name="toolUrl"
                control={control}
                rules={{ 
                  pattern: {
                    value: validationPatterns.url,
                    message: "Please enter a valid URL (e.g., https://tool.com)"
                  }
                }}
                render={({ field }) => (
                  <Input placeholder="https://tool.com" {...field} />
                )}
              />
              {errors.toolUrl && <p className="text-red-500 text-sm mt-1">{String(errors.toolUrl.message)}</p>}
            </div>
          </div>

          <div className="border border-[#0000000D] my-[20px]" />

          <div>
            <p className="uppercase font-[inter] font-medium text-[14px] text-[#808080]">
              PROOF OF OWNERSHIP
            </p>
            <p className="font-[inter] font-medium text-[12px] text-[#CCCCCC]">
              Please provide at least one form of veryfication
            </p>
          </div>

          <div className="mt-[20px]">
            <p className="uppercase font-Nunito font-semibold text-[14px] text-[#4D4D4D]  mb-[6px]">
              Company ID/Business Card
            </p>
            <Controller
              control={control}
              name="companyId"
              defaultValue={[]}
              render={({ field }) => (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileImageInputRef}
                    onChange={(e) => handleScreenshotsChange(e, field)}
                    style={{ display: 'none' }}
                  />
                  <div
                    className="flex items-center justify-center gap-1 border border-[#F2F2F2] border-dashed w-full h-[80px] rounded-md cursor-pointer"
                    onClick={handleScreenshotsDivClick}
                  >
                    <div>
                      <svg
                        width="16"
                        height="21"
                        viewBox="0 0 16 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full"
                      >
                        <path
                          d="M2.90265 20.5C1.9469 20.5 1.22419 20.2611 0.734513 19.7832C0.244838 19.3054 0 18.5973 0 17.6591V9.05769C0 8.12529 0.244838 7.42016 0.734513 6.94231C1.22419 6.45862 1.9469 6.21678 2.90265 6.21678H5.46903V7.93881H3.00885C2.59587 7.93881 2.28024 8.04662 2.06195 8.26224C1.84956 8.47203 1.74336 8.78963 1.74336 9.21504V17.5105C1.74336 17.9359 1.84956 18.2535 2.06195 18.4633C2.28024 18.6789 2.59587 18.7867 3.00885 18.7867H12.9823C13.3894 18.7867 13.7021 18.6789 13.9204 18.4633C14.1445 18.2535 14.2566 17.9359 14.2566 17.5105V9.21504C14.2566 8.78963 14.1445 8.47203 13.9204 8.26224C13.7021 8.04662 13.3894 7.93881 12.9823 7.93881H10.531V6.21678H13.0973C14.0531 6.21678 14.7758 6.45862 15.2655 6.94231C15.7552 7.42016 16 8.12529 16 9.05769V17.6591C16 18.5915 15.7552 19.2966 15.2655 19.7745C14.7758 20.2582 14.0531 20.5 13.0973 20.5H2.90265ZM8 13.5332C7.77581 13.5332 7.58112 13.4545 7.41593 13.2972C7.25664 13.1399 7.17699 12.9534 7.17699 12.7378V3.93531L7.24779 2.63287L6.69027 3.27098L5.45133 4.58217C5.30973 4.73951 5.12684 4.81818 4.90265 4.81818C4.69617 4.81818 4.52212 4.75408 4.38053 4.62587C4.24484 4.49184 4.17699 4.32284 4.17699 4.11888C4.17699 3.9324 4.25074 3.76049 4.39823 3.60315L7.37168 0.77972C7.48378 0.674825 7.58997 0.601981 7.69027 0.561189C7.79056 0.520396 7.89381 0.5 8 0.5C8.10619 0.5 8.20944 0.520396 8.30973 0.561189C8.41003 0.601981 8.51327 0.674825 8.61947 0.77972L11.5929 3.60315C11.7463 3.76049 11.823 3.9324 11.823 4.11888C11.823 4.32284 11.7493 4.49184 11.6018 4.62587C11.4602 4.75408 11.2891 4.81818 11.0885 4.81818C10.8702 4.81818 10.6873 4.73951 10.5398 4.58217L9.30089 3.27098L8.75221 2.63287L8.82301 3.93531V12.7378C8.82301 12.9534 8.74041 13.1399 8.57522 13.2972C8.41593 13.4545 8.22419 13.5332 8 13.5332Z"
                          fill="#CCCCCC"
                        />
                      </svg>
                      <p className="font-[inter] font-medium text-[12px] text-[#CCCCCC]">
                        Drag and drop files here or select from your computer
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {(field.value || []).map((file: string | File, index: number) => {
                      const src = typeof file === 'string' ? file : URL.createObjectURL(file);
                      
                      return (
                        <div className="relative" key={index}>
                          <Image
                            src={src}
                            alt={`preview-${index}`}
                            width={60}
                            height={60}
                            className="object-cover rounded"
                            unoptimized={true}
                          />
                          <svg
                            width="8"
                            height="8"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="cursor-pointer absolute bottom-11 left-12"
                            onClick={() => {
                              const newFiles = [...field.value];
                              newFiles.splice(index, 1);
                              field.onChange(newFiles);
                            }}
                          >
                            <path
                              d="M0.322681 15.677C0.177061 15.5379 0.0810839 15.3723 0.0347502 15.1801C-0.0115834 14.988 -0.0115834 14.7959 0.0347502 14.6037C0.087703 14.4116 0.18368 14.2493 0.322681 14.1168L6.41886 7.99503L0.322681 1.88323C0.18368 1.75072 0.0910125 1.58841 0.0446789 1.39627C-0.00165477 1.20414 -0.00165477 1.01201 0.0446789 0.819876C0.0910125 0.627743 0.18368 0.462112 0.322681 0.322981C0.468301 0.177226 0.637088 0.0811594 0.829041 0.0347826C1.02099 -0.0115942 1.21295 -0.0115942 1.4049 0.0347826C1.59686 0.0811594 1.76233 0.173913 1.90133 0.313043L8.00745 6.42484L14.1036 0.313043C14.2426 0.167288 14.4081 0.0745342 14.6001 0.0347826C14.792 -0.0115942 14.9807 -0.0115942 15.166 0.0347826C15.3579 0.0811594 15.53 0.177226 15.6823 0.322981C15.8213 0.462112 15.914 0.627743 15.9603 0.819876C16.0132 1.01201 16.0132 1.20414 15.9603 1.39627C15.914 1.58178 15.8213 1.74741 15.6823 1.89317L9.5861 7.99503L15.6823 14.1068C15.8213 14.2526 15.914 14.4215 15.9603 14.6137C16.0066 14.7992 16.0066 14.988 15.9603 15.1801C15.914 15.3723 15.8213 15.5379 15.6823 15.677C15.5367 15.8228 15.3679 15.9188 15.1759 15.9652C14.984 16.0116 14.792 16.0116 14.6001 15.9652C14.4081 15.9188 14.2426 15.8261 14.1036 15.687L8.00745 9.57516L1.90133 15.687C1.76233 15.8261 1.59686 15.9188 1.4049 15.9652C1.21957 16.0116 1.02761 16.0116 0.829041 15.9652C0.637088 15.9188 0.468301 15.8228 0.322681 15.677Z"
                              fill="red"
                              fillOpacity="1"
                            />
                          </svg>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            />
          </div>

          <div className="mt-[20px]">
            <p className="uppercase font-Nunito font-semibold text-[14px] text-[#4D4D4D]  mb-[6px]">
              Professional Profile: (LinkedIn, GitHub, etc.)
            </p>
            <Controller
              name="profile"
              control={control}
              rules={{ 
                required: "Professional profile is required",
                pattern: {
                  value: validationPatterns.url,
                  message: "Please enter a valid URL (e.g., https://linkedin.com/in/yourprofile)"
                }
              }}
              render={({ field }) => (
                <Input placeholder="https://linkedin.com/in/yourprofile" {...field} />
              )}
            />
            {errors.profile && <p className="text-red-500 text-sm mt-1">{String(errors.profile.message)}</p>}
          </div>

          <div className="border border-[#0000000D] my-[20px]" />

          <p className="uppercase font-medium font-[inter] text-[14px] text-[#808080]">
            ADDITIONAL INFORMATION
          </p>

          <div className="mt-[20px]">
            <p className="uppercase font-Nunito font-semibold text-[14px] text-[#4D4D4D]  mb-[6px]">
              Why are you claiming this tool? *
            </p>
            <Controller
              name="information"
              control={control}
              rules={{ required: "Please provide information about why you're claiming this tool" }}
              render={({ field }) => (
                <Input placeholder="Type" {...field} />
              )}
            />
            {errors.information && <p className="text-red-500 text-sm mt-1">{String(errors.information.message)}</p>}
          </div>

          <div className="mt-[20px] ">
            <BottomButtons
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              setShowModal={setShowModal}
              toolMutation={toolMutation}
              input={watchedValues}
              onValidate={validateForm}
              handleSubmission={handleSubmission}
            />
          </div>
        </div>
      </div>
    </>
  );
}
