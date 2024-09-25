import { useState } from "react";

export const useDeleteConfirmation = (handleDeleteRow: (id: string) => void) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [rowToDelete, setRowToDelete] = useState<string | null>(null);

  const openDeleteDialog = (id: string) => {
    setRowToDelete(id);
    setConfirmDialogOpen(true);
  };

  const confirmDelete = () => {
    if (rowToDelete) {
      handleDeleteRow(rowToDelete);  // Вызываем удаление строки
      setRowToDelete(null);
    }
    setConfirmDialogOpen(false); // Закрываем диалог
  };

  const cancelDelete = () => {
    setRowToDelete(null);
    setConfirmDialogOpen(false);
  };

  return {
    confirmDialogOpen,
    openDeleteDialog,
    confirmDelete,
    cancelDelete,
  };
};
