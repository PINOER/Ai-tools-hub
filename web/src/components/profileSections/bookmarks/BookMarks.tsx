import { useState, useRef } from "react";
import BookMarksData from "./BookMarksData";

const tags = [
    { id: 10, label: "AI Tools" },
    { id: 11, label: "News" },
    { id: 12, label: "Articles" },
    { id: 13, label: "Learning" },
    { id: 14, label: "Prompts" },
    { id: 15, label: "Glossary" }
];

export default function BookMarks() {
    const [selectedTag, setSelectedTag] = useState(tags[0].id);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const isClickBlockedRef = useRef(false);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        setIsDragging(true);
        isClickBlockedRef.current = false;
        setStartX(e.pageX - containerRef.current.offsetLeft);
        setScrollLeft(containerRef.current.scrollLeft);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !containerRef.current) return;
        e.preventDefault();
        const x = e.pageX - containerRef.current.offsetLeft;
        const walk = x - startX;
        if (Math.abs(walk) > 5) isClickBlockedRef.current = true;
        containerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUpOrLeave = () => {
        setIsDragging(false);
    };

    const handleClick = (tagId: number) => {
        if (!isClickBlockedRef.current) setSelectedTag(tagId);
    };

    const selectedTagLabel = tags.find(tag => tag.id === selectedTag)?.label || "AI Tools";

    return (
        <>
            <div className="mt-[20px]">
                <div
                    ref={containerRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUpOrLeave}
                    onMouseLeave={handleMouseUpOrLeave}
                    className="flex flex-nowrap gap-2 py-1 px-1 overflow-x-auto scrollbar-hide cursor-grab select-none"
                >
                    {tags.map((tag, index) => {
                        const isActive = selectedTag === tag.id;
                        return (
                            <button
                                key={index}
                                onClick={() => handleClick(tag.id)}
                                style={isActive ? { backgroundColor: "#4D4D4D", color: '#ffffff' } : {}}
                                className={`whitespace-nowrap text-[15px] font-[Nunito] rounded-lg border border-[#ececec] px-[10px] py-[4px] text-sm transition-colors font-semibold ${isActive ? '' : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {tag.label}
                            </button>
                        );
                    })}
                </div>
            </div>
            <BookMarksData selectedCategory={selectedTagLabel} />
        </>
    );
}