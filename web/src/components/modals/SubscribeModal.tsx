import { useState } from "react";
import SharedNewsLetter from "../shared/SharedNewsLetter";

export default function SubscribeModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [subscribed, setSubscribed] = useState(true)
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
             <div className="relative w-full max-w-3xl h-[80vh] sm:h-[60vh] bg-white rounded-[25px] shadow-xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-8 text-gray-500 cursor-pointer hover:text-gray-700"
          aria-label="Close modal"
        >
          ✕
        </button>
        
        <SharedNewsLetter subscribed={subscribed} setSubscribed={setSubscribed} />
      </div>
    </div>
  );
}
