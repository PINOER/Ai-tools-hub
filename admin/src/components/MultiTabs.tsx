interface MultiTabsProps {
  selectedTabs: string[];
  setSelectedTabs: (tabs: string[]) => void;
  options: string[];
  tabClickable?: boolean;
}

const MultiTabs = ({
  selectedTabs,
  setSelectedTabs,
  options,
  tabClickable = true,
}: MultiTabsProps) => {
  const toggleTabs = (option: string) => {
    const currentTabs = selectedTabs || [];
    const isSelected = currentTabs.includes(option);
    const newTabs = isSelected
      ? currentTabs.filter((tab) => tab !== option)
      : [...currentTabs, option];

    setSelectedTabs(newTabs);
  };

  const currentTabs = selectedTabs || [];

  return (
    <div className='flex items-center gap-4 text-sm'>
      {options.map((option) => (
        <p
          key={option}

          className={`rounded-md py-[4px] px-[10px] ${tabClickable && 'cursor-pointer'} ${currentTabs.includes(option)
              ? 'bg-[#4D4D4D] text-white font-Nunito font-semibold text-[15px]'
              : 'bg-white border-2 border-[#F2F2F2] font-Nunito font-semibold text-[15px]'
            }`}
          onClick={() => {
            if (tabClickable) {
              toggleTabs(option);
            }
          }}


        >
          {option}
        </p>
      ))}
    </div>
  );
};

export default MultiTabs;
