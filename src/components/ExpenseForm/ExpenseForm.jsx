import { useState, useEffect } from "react";
import Typography from "../Typography/Typography.jsx";
import Input from "../Input/Input.jsx";
import SelectInput from "../Input/SelectInput.jsx";
import Button from "../Button/Button.jsx";

const ExpenseForm = ({
  initialData = null,
  errors = {},
  onChange,
  onSubmit,
  isValid = true,
}) => {
  const [formData, setFormData] = useState({
    category: initialData?.category || "",
    amount: initialData?.amount || "",
    date: initialData?.date || "",
    description: initialData?.description || "",
    recurrence: initialData?.recurrence || "none",
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
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);

    if (onChange) {
      onChange(updatedData);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <div className="expense-form__fields">
        <div className="expense-form__field">
          <Typography className="expense-form__label" variant="p2">
            Category
          </Typography>

          <SelectInput
            name="category"
            value={formData.category}
            onChange={(value) => handleChange("category", value)}
          />

          {errors.category && (
            <Typography className="expense-form__error" variant="p3">
              {errors.category}
            </Typography>
          )}
        </div>

        <div className="expense-form__field">
          <Typography className="expense-form__label" variant="p2">
            Amount
          </Typography>

          <Input
            name="amount"
            type="number"
            value={formData.amount}
            onChange={(value) => handleChange("amount", value)}
          />

          {errors.amount && (
            <Typography className="expense-form__error" variant="p3">
              {errors.amount}
            </Typography>
          )}
        </div>

        <div className="expense-form__field">
          <Typography className="expense-form__label" variant="p2">
            Date
          </Typography>

          <SelectInput
            name="date"
            value={formData.date}
            onChange={(value) => handleChange("date", value)}
          />

          {errors.date && (
            <Typography className="expense-form__error" variant="p3">
              {errors.date}
            </Typography>
          )}
        </div>

        <div className="expense-form__field">
          <Typography className="expense-form__label" variant="p2">
            Recurrence
          </Typography>

          <SelectInput
            name="recurrence"
            value={formData.recurrence}
            onChange={(value) => handleChange("recurrence", value)}
          />

          {errors.recurrence && (
            <Typography className="expense-form__error" variant="p3">
              {errors.recurrence}
            </Typography>
          )}
        </div>

        <div className="expense-form__field expense-form__field--full">
          <Typography className="expense-form__label" variant="p2">
            Description
          </Typography>

          <Input
            name="description"
            type="text"
            value={formData.description}
            onChange={(value) => handleChange("description", value)}
          />

          {errors.description && (
            <Typography className="expense-form__error" variant="p3">
              {errors.description}
            </Typography>
          )}
        </div>
      </div>

      <div className="expense-form__actions">
        <Button type="submit" disabled={!isValid || (initialData && !isDirty)}>
          {initialData ? "Update Expense" : "Add Expense"}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;
