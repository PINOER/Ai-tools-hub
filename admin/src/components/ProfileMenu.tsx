import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const userHook = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    userHook.logout();
    navigate("/login");
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center rounded-full hover:cursor-pointer">
          <img
            src="/icons/ProfileIcon.svg"
            alt="Notifications"
            style={{ height: 32, width: 32 }}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Admin User</p>
            <p className="text-xs leading-none text-muted-foreground">
              admin@aitools.hub
            </p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/settings")}>
          <img
            src="/icons/UserIcon.svg"
            alt="Profile"
            style={{ height: 16, width: 16 }}
            className="mr-2"
          />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/settings")}>
          <img
            src="/icons/SettingsIcon.svg"
            alt="Settings"
            style={{ height: 16, width: 16 }}
            className="mr-2"
          />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <img
            src="/icons/LogoutIcon.svg"
            alt="Logout"
            style={{ height: 16, width: 16 }}
            className="mr-2"
          />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
