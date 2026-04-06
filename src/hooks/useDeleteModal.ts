import { useState } from "react";
import api from "../utils/axios";

interface Identifiable {
  id: string | number;
}

export const useDeleteModal = <T extends Identifiable>(endpoint: string, setData: (data: T[]) => void) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [deleteItem, setDeleteItem] = useState<T | null>(null);

  const openDeleteModal = (item: T) => {
    setDeleteItem(item);
    setModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteItem(null);
    setModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;

    try {
      await api.delete(`${endpoint}/${deleteItem.id}`);
      const response = await api.get<T[]>(`${endpoint}`);
      setData(response.data);
    } catch (error) {
      console.error("failed to delete item");
    }

    closeDeleteModal();
  };

  return {
    modalOpen,
    deleteItem,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
  };
};
