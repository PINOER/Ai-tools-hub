import React, { useCallback } from "react";
import { useUsersFilters } from "@/hooks/filters/useUsersFilters";
import { useUsersQuery } from "@/hooks/queries/useUsersQuery";
import { getUsersColumns } from './UsersTableColumns';
import { useUsersActions } from './UsersActions';
import { QueryErrorHandler } from '@/components/shared/QueryErrorHandler';
import { DataTabSection } from '@/components/shared/DataTabSection';
import { useUsers } from '@/contexts/UsersContext';
import type { User } from '@/types/user';

export const UsersTab: React.FC = () => {
  const { 
    openModal, 
    closeModal, 
    modals,
    setUserToView
  } = useUsers();

  const { filters, updateFilters, clearFilters, filterOptions } = useUsersFilters();

  const {
    data: usersData,
    isLoading: loading,
    error: usersError,
    refetch: refetchUsers,
  } = useUsersQuery(filters);

  const usersDataArray = usersData?.users || [];
  const pagination = {
    page: usersData?.pagination?.page || 1,
    limit: usersData?.pagination?.limit || 10,
    total: usersData?.pagination?.total || usersDataArray.length,
    totalPages: usersData?.pagination?.totalPages || Math.ceil(usersDataArray.length / 10),
  };

  const {
    banUsers,
    suspendUsers,
    activateUsers,
    deleteSelectedUsers,
  } = useUsersActions({
    users: usersDataArray,
  });

  // Get columns using the new column functions
  const columns = getUsersColumns({
    setEditDialogOpen: () => openModal('editUser'),
    setUserDetailsOpen: () => openModal('userDetails'),
    setDeleteDialogOpen: () => openModal('deleteUser'),
    setUserToView,
    onBanUser: (user: User) => {
      setUserToView(user);
      openModal('banUser');
    },
    onSuspendUser: (user: User) => {
      setUserToView(user);
      openModal('suspendUser');
    },
    onActivateUser: (user: User) => {
      setUserToView(user);
      openModal('activateUser');
    },
    deleteSelectedUsers,
    banUsers,
    suspendUsers,
    activateUsers,
  });

  const handleCreate = useCallback(() => {
    openModal('createUser');
  }, [openModal]);

  const handleImport = useCallback(() => {
    openModal('importUser');
  }, [openModal]);

  const handleExport = useCallback(() => {
    // TODO: Implement export functionality
    console.log('Export users');
  }, []);

  // Show error state
  if (usersError) {
    return (
      <QueryErrorHandler
        error={usersError}
        refetch={refetchUsers}
        title="Failed to load users"
        message="Unable to fetch users data. Please check your connection and try again."
      />
    );
  }

  return (
    <DataTabSection
      title="Users"
      filters={filters}
      updateFilters={updateFilters}
      clearFilters={clearFilters}
      filterOptions={filterOptions}
      data={usersDataArray}
      loading={loading}
      modals={modals}
      pagination={pagination}
      columns={columns}
      openModal={openModal}
      closeModal={closeModal}
      onCreate={handleCreate}
      onImport={handleImport}
      onExport={handleExport}
    />
  );
}; 