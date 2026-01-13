import { useState, useCallback } from 'react';

export function useModalState<T extends string>(modalNames: T[]) {
  const [modals, setModals] = useState<Record<T, boolean>>(() => {
    const initial: Record<T, boolean> = {} as Record<T, boolean>;
    modalNames.forEach(name => {
      initial[name] = false;
    });
    return initial;
  });

  const openModal = useCallback((modalName: T) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
  }, []);

  const closeModal = useCallback((modalName: T) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
  }, []);

  const toggleModal = useCallback((modalName: T, value?: boolean) => {
    setModals(prev => ({ 
      ...prev, 
      [modalName]: value !== undefined ? value : !prev[modalName] 
    }));
  }, []);

  const closeAllModals = useCallback(() => {
    const closed: Record<T, boolean> = {} as Record<T, boolean>;
    modalNames.forEach(name => {
      closed[name] = false;
    });
    setModals(closed);
  }, [modalNames]);

  return {
    modals,
    openModal,
    closeModal,
    toggleModal,
    closeAllModals,
  };
} 