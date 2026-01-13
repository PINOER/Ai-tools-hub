import {
  useBanUserMutation,
  useSuspendUserMutation,
  useActivateUserMutation,
  useBulkUsersMutation,
} from "@/hooks/queries/useUsersQuery";
import type { User } from "@/types/user";

interface UseUsersActionsProps {
  users: User[];
  setUsers?: (users: User[] | ((prev: User[]) => User[])) => void;
}

export function useUsersActions({ setUsers }: UseUsersActionsProps) {
  const banUserMutation = useBanUserMutation();
  const suspendUserMutation = useSuspendUserMutation();
  const activateUserMutation = useActivateUserMutation();
  const bulkUsersMutation = useBulkUsersMutation();

  const banUser = async (user: User) => {
    await banUserMutation.mutateAsync(user);
    setUsers?.((prevUsers) =>
      prevUsers.map((u) =>
        u.id === user.id ? { ...u, status: "Banned" as const } : u
      )
    );
  };

  const suspendUser = async (user: User) => {
    await suspendUserMutation.mutateAsync(user);
    setUsers?.((prevUsers) =>
      prevUsers.map((u) =>
        u.id === user.id ? { ...u, status: "Suspended" as const } : u
      )
    );
  };

  const activateUser = async (user: User) => {
    await activateUserMutation.mutateAsync(user);
    setUsers?.((prevUsers) =>
      prevUsers.map((u) =>
        u.id === user.id ? { ...u, status: "Active" as const } : u
      )
    );
  };

  const banUsers = async (userIds: number[]) => {
    await bulkUsersMutation.mutateAsync({ action: "ban", userIds });
    setUsers?.((prevUsers) =>
      prevUsers.map((user) =>
        userIds.includes(user.id)
          ? { ...user, status: "Banned" as const }
          : user
      )
    );
  };

  const suspendUsers = async (userIds: number[]) => {
    await bulkUsersMutation.mutateAsync({ action: "suspend", userIds });
    setUsers?.((prevUsers) =>
      prevUsers.map((user) =>
        userIds.includes(user.id)
          ? { ...user, status: "Suspended" as const }
          : user
      )
    );
  };

  const activateUsers = async (userIds: number[]) => {
    await bulkUsersMutation.mutateAsync({ action: "activate", userIds });
    setUsers?.((prevUsers) =>
      prevUsers.map((user) =>
        userIds.includes(user.id)
          ? { ...user, status: "Active" as const }
          : user
      )
    );
  };

  const deleteSelectedUsers = async (userIds: number[]) => {
    await bulkUsersMutation.mutateAsync({ action: "delete", userIds });
    setUsers?.((prevUsers) =>
      prevUsers.filter((user) => !userIds.includes(user.id))
    );
  };

  return {
    banUser,
    suspendUser,
    activateUser,
    banUsers,
    suspendUsers,
    activateUsers,
    deleteSelectedUsers,
  };
}
