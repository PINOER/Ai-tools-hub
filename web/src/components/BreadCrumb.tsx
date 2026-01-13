import Image from "next/image";
import Link from "next/link";

interface BreadCrumbItem {
  name: string;
  path?: string;
  icon?: string;
}

export default function BreadCrumb({ items }: { items: BreadCrumbItem[] }) {
  return (
    <nav className="flex items-center space-x-2  mb-6">
      {items.map((item, index) => (
        <div className="flex items-center gap-2" key={index}>
          {item.icon && (
            <Image src={item.icon} alt="arrow" width={20} height={20} />
          )}
          {index === items.length - 1 ? (
            <span className="font-Nunito font-semibold text-[15px] text-[#808080]">
              {item.name}
            </span>
          ) : (
            <Link
              href={item.path || ""}
              className="hover:text-blue-600 transition-colors font-Nunito font-semibold text-[15px] text-[#808080]"
            >
              {item.name}
            </Link>
          )}
          {index < items.length - 1 && (
            <Image src="/right.svg" alt="arrow" width={16} height={16} />
          )}
        </div>
      ))}
    </nav>
  );
}
