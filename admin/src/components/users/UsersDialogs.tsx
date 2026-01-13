import React from "react";
import { UserDetailsDialog } from "./UserDetailsDialog";
import { EditUserDialog } from "./EditUserDialog";
import { ImportUsersDialog } from "./ImportUsers";
import { CreateUserDialog } from "./CreateUserDialog";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { UserActionDialog } from "./UserActionDialog";
import { useUsers } from "@/contexts/UsersContext";
import {
  useDeleteUserMutation,
  useSuspendUserMutation,
  useBanUserMutation,
} from "@/hooks/queries/useUsersQuery";
import { showErrorToast } from "@/lib/toast";
import { useUser } from "@/hooks/useUser";

export const UsersDialogs = React.memo(() => {
  const { modals, closeModal, userToView } = useUsers();

  const deleteUserMutation = useDeleteUserMutation();
  const suspendUserMutation = useSuspendUserMutation();
  const banUserMutation = useBanUserMutation();
  const { userId } = useUser();

  const deleteUser = async (id: number) => {
    if (id === userId) {
      showErrorToast("You cannot delete your own account.");
      return;
    }

    await deleteUserMutation.mutateAsync(id);
    closeModal("deleteUser");
  };

  const suspendUser = async (id: number) => {
    if (id === userId) {
      showErrorToast("You cannot suspend your own account.");
      return;
    }

    if (!userToView) {
      showErrorToast("User not found.");
      return;
    }

    await suspendUserMutation.mutateAsync(userToView);
    closeModal("suspendUser");
  };

  const banUser = async (id: number) => {
    // Prevent user from banning themselves
    if (id === userId) {
      showErrorToast("You cannot ban your own account.");
      return;
    }

    if (!userToView) {
      showErrorToast("User not found.");
      return;
    }

    await banUserMutation.mutateAsync(userToView);
    closeModal("banUser");
  };

  return (
    <>
      <UserDetailsDialog
        user={userToView}
        open={modals.userDetails}
        onOpenChange={() => closeModal("userDetails")}
      />

      <EditUserDialog
        user={userToView}
        open={modals.editUser}
        onOpenChange={() => closeModal("editUser")}
      />

      <ImportUsersDialog
        open={modals.importUser}
        onOpenChange={() => closeModal("importUser")}
      />

      <CreateUserDialog
        open={modals.createUser}
        onOpenChange={() => closeModal("createUser")}
      />

      <DeleteUserDialog
        open={modals.deleteUser}
        onOpenChange={() => closeModal("deleteUser")}
        user={userToView}
        deleteUser={deleteUser}
      />

      <UserActionDialog
        open={modals.suspendUser}
        onOpenChange={() => closeModal("suspendUser")}
        user={userToView}
        action="suspend"
        onAction={suspendUser}
      />

      <UserActionDialog
        open={modals.banUser}
        onOpenChange={() => closeModal("banUser")}
        user={userToView}
        action="ban"
        onAction={banUser}
      />
    </>
  );
});
