import api from "../../utils/axios.js";
import ExpenseForm from "../../components/ExpenseForm/ExpenseForm.jsx";
import { useNavigate } from "react-router-dom";

const AddExpensePage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      console.log(formData);
      await api.post("/expenses", formData);
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
