import api from "../../utils/axios";
import ExpenseForm from "../../components/ExpenseForm/ExpenseForm";
import { useNavigate } from "react-router-dom";
import type { ExpenseFormData } from "../../types/types";
import type { FC } from "react";

const AddExpensePage: FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData: ExpenseFormData): Promise<void> => {
    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount),
      };
      console.log("Submitting expense", payload);
      await api.post("/expenses", payload);
      navigate("/expenses");
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <div className="add-expense-page">
      <ExpenseForm onSubmit={handleSubmit} headerText="Add Expense" />
    </div>
  );
};

export default AddExpensePage;
