"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useNotificationContext } from "@/contexts/NotificationContext";
import { Notification } from "@/types/api";
import { useRouter } from "next/navigation";

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    isMarkingAllAsRead,
    hasMore,
    loadMore,
    isLoadingMore,
  } = useNotificationContext();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    if (notification?.action_url) {
      router.push(notification?.action_url);
    }
    setIsOpen(false);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const getNotificationIcon = () => {
    return "/bell-icon.svg";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative cursor-pointer rounded-[10px] border border-[#F2F2F2] hover:bg-gray-100 transition-colors"
      >
        <Image
          src="/bell-icon.svg"
          alt="Bell Icon"
          width={30}
          height={30}
          style={{ padding: "6px" }}
        />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[380px] max-h-[500px] bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Notifications {unreadCount > 0 && `(${unreadCount})`}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto max-h-[420px]">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">
                Failed to load notifications
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <Image
                  src="/bell-icon.svg"
                  alt="No notifications"
                  width={48}
                  height={48}
                  className="opacity-30 mb-3"
                />
                <p className="text-gray-500 text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <Image
                            src={getNotificationIcon()}
                            alt="notification"
                            width={20}
                            height={20}
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {notification.timeAgo}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer - Load More */}
          {hasMore && notifications.length > 0 && (
            <div className="border-t border-gray-200 p-3 text-center">
              <button
                onClick={loadMore}
                disabled={isLoadingMore}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full"
              >
                {isLoadingMore ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <span className="cursor-pointer">
                      Load more notifications
                    </span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Show total loaded */}
          {notifications.length > 20 && !hasMore && (
            <div className="border-t border-gray-200 p-3 text-center">
              <p className="text-xs text-gray-500">
                All {notifications.length} notifications loaded
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
