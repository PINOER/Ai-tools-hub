import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { ProfileMenu } from "@/components/ProfileMenu";
import NotificationsDropdown from "@/components/notification/NotificationsDropdown";

const Layout = () => {
  return (
    <div className="flex h-screen bg-[#F9F9F9]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="flex justify-end p-4 pb-0 gap-4">
          <button className="flex items-center justify-center rounded-full hover:cursor-pointer">
            <img
              src="/icons/PlusIcon.svg"
              alt="Add"
              style={{ height: 32, width: 32 }}
            />
          </button>
          <NotificationsDropdown />
          <ProfileMenu />
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
