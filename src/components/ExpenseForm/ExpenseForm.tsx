import { useState, useEffect, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../Input/Input";
import SelectInput from "../Input/SelectInput";
import Button from "../Button/Button";
import PageHeader from "../PageHeader/PageHeader";
import {
  validateAmount,
  validateDescription,
  validateDate,
} from "../../utils/validation.js";
import type { ExpenseFormData, ExpenseCategory, RecurrenceType } from "../../types/types";
import "./ExpenseForm.scss";

interface ExpenseFormProps {
  initialData?: ExpenseFormData | null;
  onSubmit: (data: ExpenseFormData) => void;
  headerText: string;
}

interface FormErrors {
  amount: string;
  description: string;
  date: string;
}

const ExpenseForm = ({ initialData = null, onSubmit, headerText = "" }: ExpenseFormProps) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ExpenseFormData>({
    category: initialData?.category || "Food",
    amount: initialData?.amount || "",
    date: initialData?.date || "",
    description: initialData?.description || "",
    recurrence: initialData?.recurrence || "none",
  });

  const [errors, setErrors] = useState<FormErrors>({
    amount: "",
    description: "",
    date: "",
  });

  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (!initialData) return;

    const changed = (Object.keys(formData) as Array<keyof ExpenseFormData>).some(
      (key) => formData[key] !== initialData[key],
    );

    setIsDirty(changed);
  }, [formData, initialData]);

  const handleChange = (field: keyof ExpenseFormData, value: string) => {
    let updatedValue = value;

    if (field === "description") {
      updatedValue = value.slice(0, 36);
    }

    if (field === "amount") {
    const [whole, decimal] = value.split(".");

      if (decimal && decimal.length > 2) {
        updatedValue = `${whole}.${decimal.slice(0, 2)}`;
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

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
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
        headerText={headerText}
        onBack={goToExpenses}
      />
      <div className="expense-form__fields">
        <SelectInput
          label="Category"
          className="expense-form__field"
          value={formData.category}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChange("category", e.target.value as ExpenseCategory)}
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
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("amount", e.target.value)}
          error={errors.amount}
          placeholder="0.00"
        />

        <Input
          label="Date"
          className="expense-form__field"
          type="date"
          value={formData.date}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("date", e.target.value)}
          error={errors.date}
        />

        <SelectInput
          label="Recurrence"
          className="expense-form__field"
          value={formData.recurrence}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChange("recurrence", e.target.value as RecurrenceType)}
          options={[
            { value: "none", label: "None" },
            { value: "weekly", label: "Weekly" },
            { value: "monthly", label: "Monthly" },
          ]}
        />

        <Input
          label="Description"
          className="expense-form__field"
          type="text"
          value={formData.description}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("description", e.target.value)}
          error={errors.description}
        />
      </div>

      <div className="expense-form__actions">
        <Button
          type="submit"
          disabled={
            !!(errors.amount || errors.description || errors.date || (initialData && !isDirty))
          }
        >
          {initialData ? "Update Expense" : "Add Expense"}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;
