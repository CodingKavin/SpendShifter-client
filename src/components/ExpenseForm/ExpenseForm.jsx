import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../Input/Input.jsx";
import SelectInput from "../Input/SelectInput.jsx";
import Button from "../Button/Button.jsx";
import PageHeader from "../../components/PageHeader/PageHeader.jsx";
import {
  validateAmount,
  validateDescription,
  validateDate,
} from "../../utils/validation.js";
import "./ExpenseForm.scss";

const ExpenseForm = ({ initialData = null, onSubmit, headerText = "" }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: initialData?.category || "Food",
    amount: initialData?.amount || "",
    date: initialData?.date || "",
    description: initialData?.description || "",
    recurrence: initialData?.recurrence || "none",
  });

  const [errors, setErrors] = useState({
    amount: "",
    description: "",
    date: "",
  });

  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (!initialData) return;

    const changed = Object.keys(formData).some(
      (key) => formData[key] !== initialData[key],
    );

    setIsDirty(changed);
  }, [formData, initialData]);

  const handleChange = (field, value) => {
    let updatedValue = value;

    if (field === "description") {
      updatedValue = value.slice(0, 36);
    }

    if (field === "amount") {
      const parts = value.split(".");
      if (parts[1]?.length > 2) {
        updatedValue = parts[0] + "." + parts[1].slice(0, 2);
      }
    }

    if (field === "date") {
      setErrors((prev) => ({
        ...prev,
        date: validateDate(updatedValue),
      }));
    }

    const updatedData = {
      ...formData,
      [field]: updatedValue,
    };

    setFormData(updatedData);

    if (field === "amount") {
      setErrors((prev) => ({
        ...prev,
        amount: validateAmount(updatedValue),
      }));
    }

    if (field === "description") {
      setErrors((prev) => ({
        ...prev,
        description: validateDescription(updatedValue),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const amountError = validateAmount(formData.amount);
    const descriptionError = validateDescription(formData.description);
    const dateError = validateDate(formData.date);

    const newErrors = {
      amount: amountError,
      description: descriptionError,
      date: dateError,
    };

    setErrors(newErrors);

    if (!amountError && !descriptionError && !dateError) {
      onSubmit(formData);
    }
  };

  const goToExpenses = () => {
    navigate("/expenses");
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <PageHeader
        variant="noedit"
        headerText={headerText}
        onBack={goToExpenses}
      />
      <div className="expense-form__fields">
        <SelectInput
          label="Category"
          className="expense-form__field"
          value={formData.category}
          onChange={(e) => handleChange("category", e.target.value)}
          options={[
            { value: "Food", label: "Food" },
            { value: "Transportation", label: "Transportation" },
            { value: "Housing", label: "Housing" },
            { value: "Entertainment", label: "Entertainment" },
            { value: "Lifestyle", label: "Lifestyle" },
            { value: "Other", label: "Other" },
          ]}
        />

        <Input
          label="Amount"
          className="expense-form__field"
          type="text"
          value={formData.amount}
          onChange={(e) => handleChange("amount", e.target.value)}
          error={errors.amount}
          placeholder="0.00"
        />

        <Input
          label="Date"
          className="expense-form__field"
          type="date"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
          error={errors.date}
        />

        <SelectInput
          label="Recurrence"
          className="expense-form__field"
          value={formData.recurrence}
          onChange={(e) => handleChange("recurrence", e.target.value)}
          options={[
            { value: "none", label: "None" },
            { value: "daily", label: "Daily" },
            { value: "weekly", label: "Weekly" },
            { value: "monthly", label: "Monthly" },
          ]}
        />

        <Input
          label="Description"
          className="expense-form__field"
          type="text"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          error={errors.description}
        />
      </div>

      <div className="expense-form__actions">
        <Button
          type="submit"
          disabled={
            errors.amount || errors.description || (initialData && !isDirty)
          }
        >
          {initialData ? "Update Expense" : "Add Expense"}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;
