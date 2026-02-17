import { useState } from "react";
import { deleteupdate } from "../utils/apiRequests.js";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

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
            await deleteupdate(`${deleteEndpoint}/${deleteItem.id}`, setData, endpoint)
        } catch (error) {
            console.error("failed to delete item");
        }

        closeDeleteModal();
    }

    return { modalOpen, deleteItem, openDeleteModal, closeDeleteModal, confirmDelete };
}