import { useState } from "react";
import api from "../utils/axios.js";

export const useDeleteModal = (setData, endpoint) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const openDeleteModal = (item) => {
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
