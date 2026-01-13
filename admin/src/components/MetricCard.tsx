import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: React.ReactNode | string;
  value: string;
  change: string;
  icon?: string;
  isPositive?: boolean;
}

const MetricCard = ({ title, value, change, icon, isPositive = true }: MetricCardProps) => {
  return (
    <div className="relative bg-white rounded-[15px] border border-[#0000000D] p-[20px] pt-[12px] pb-[50px]" style={{boxShadow: '0px 2px 8px 0px #0000000A'}}>
      <div className="flex items-center justify-start mb-4 gap-2">
        {icon && <img src={icon} alt="Profile" style={{ height: 28, width: 28 }} />}
        <div className="text-[15px] font-medium text-[#00000033] tracking-wider font-inter">
          {title}
        </div>
      </div>
      <div className="absolute bottom-[15px] left-[20px] flex items-center space-x-2">
        <div className="text-[27px] font-medium text-gray-900 font-inter">{value}</div>
        <div className={cn(
          "text-[14px] font-medium px-2 py-0.5 bg-[#0000000D] rounded-[5px]",
          isPositive ? "text-[#34C759]" : "text-red-600"
        )}>
          {change}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;