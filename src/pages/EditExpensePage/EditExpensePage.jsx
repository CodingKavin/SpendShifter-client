import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/axios.js";
import ExpenseForm from "../../components/ExpenseForm/ExpenseForm.jsx";

const EditExpensePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await api.get(`/expenses/${id}`);
        const expense = res.data;
        if (expense.date) {
          expense.date = expense.date.split("T")[0];
        }
        setInitialData(expense);
      } catch (error) {
        console.error("Error fetching expense:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      await api.patch(`/expenses/${id}`, formData);
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
