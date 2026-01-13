import { cn } from '@/lib/utils';

interface CardProps {
  children: any;
  className?: any;
}

const Card = ({ children, className }: CardProps) => {
  return (
    <div
      className={cn(
        'bg-[#F7F7F7] p-3  flex flex-col gap-3 rounded-lg shadow-sm mb-3',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
