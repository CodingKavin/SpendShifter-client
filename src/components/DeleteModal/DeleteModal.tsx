import { useEffect } from "react";
import Typography from "../Typography/Typography";
import Button from "../Button/Button";
import Iconography from "../Iconography/Iconography";
import "./DeleteModal.scss";

interface DeleteModalProps {
  deleteItem: string;
  variant?: "expenses";
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteModal = ({
  deleteItem,
  variant = "expenses",
  onCancel,
  onConfirm,
}: DeleteModalProps) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="delete-modal__wrapper">
      <div className="delete-modal__content">
        <button
          className="delete-modal__close"
          onClick={onCancel}
          aria-label="Close modal"
        >
          <Iconography name="close" />
        </button>

        {variant === "expenses" && (
          <>
            <Typography variant="h1" className="delete-modal__title">
              Delete {deleteItem} expense?
            </Typography>
            <Typography variant="p1" className="delete-modal__text">
              Please confirm that you’d like to delete the {deleteItem}
              expense from the list of expenses. You won’t be able to undo this
              action.
            </Typography>
          </>
        )}
        <div className="delete-modal__actions">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="delete" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
