'use client';
import { useState } from 'react';
import { FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { useAuth } from "@/contexts/AuthContext";
import Link from 'next/link';

export default function Dropdown() {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  const handleLogout = async () => {
    setLoading(true);
    try {
      logout()
    } catch (err) {
      console.error("Error signing out:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="w-[32px] h-[32px] cursor-pointer rounded-[10px] border border-[#F2F2F2] hover:bg-gray-100 transition-colors"
      >
        <FiUser className='w-[16px] h-[16px] ml-[7.5px]'/>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
            <div className="font-medium">Account</div>
          </div>
          <Link href="/profile">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full cursor-pointer text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <FiUser className="w-4 h-4" />
            Profile
          </button>
          </Link>
          <Link href="/settings">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full cursor-pointer text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <FiSettings className="w-4 h-4" />
            Settings
          </button>
          </Link>
          <div className="border-t border-gray-100 mt-2 pt-2">
            <button
              onClick={handleLogout}
              disabled={loading}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <FiLogOut className="w-4 h-4" />
              {loading ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
