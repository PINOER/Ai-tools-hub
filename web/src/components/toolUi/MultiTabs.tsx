interface MultiTabsProps {
  selectedTabs: string[];
  setSelectedTabs: (tabs: string[]) => void;
  options: string[];
}

const MultiTabs = ({
  selectedTabs,
  setSelectedTabs,
  options,
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
    <div className='flex items-center gap-4 text-sm overflow-x-auto scrollbar-hide'>
      {options.map((option) => (
        <p
          key={option}
          className={`rounded-md py-1 px-4 cursor-pointer'
           ${
             currentTabs.includes(option)
               ? 'bg-[#4D4D4D] text-white font-Nunito font-semibold text-[15px]'
               : 'bg-white border-2 border-[#F2F2F2] font-Nunito font-semibold text-[15px]'
           }`}
          onClick={() => toggleTabs(option)}
        >
          {option}
        </p>
      ))}
    </div>
  );
};

export default MultiTabs;
