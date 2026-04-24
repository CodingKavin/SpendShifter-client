import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/axios";
import ExpenseForm from "../../components/ExpenseForm/ExpenseForm";
import type {ExpenseFormData, Expense} from "../../types/types";

const EditExpensePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialData, setInitialData] = useState<ExpenseFormData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await api.get<Expense>(`/expenses/${id}`);
        const expense = res.data;

        const formattedDate = expense.date.split("T")[0];

        setInitialData({...expense, date: formattedDate ?? "", amount: String(expense.amount)});
      } catch (error: any) {
        console.error("Error fetching expense:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id]);

  const handleSubmit = async (formData: Partial<ExpenseFormData>) => {
    try {
      const payload = {
      ...formData,
      amount: Number(formData.amount)
    };
      await api.patch(`/expenses/${id}`, payload);
      navigate("/expenses");
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="edit-expense-page">
      <ExpenseForm
        initialData={initialData}
        onSubmit={handleSubmit}
        headerText="Edit Expense"
      />
    </div>
  );
};

export default EditExpensePage;
