import { useNavigate } from "react-router-dom";
import { useSearch } from "../../hooks/useSearch.js";
import { useEffect, useState } from "react";
import { useDeleteModal } from "../../hooks/useDeleteModal.js";
import TableCard from "../../components/TableCard/TableCard.jsx";
import TableCardField from "../../components/TableCard/TableCardField.jsx";
import TableCardActions from "../../components/TableCard/TableCardActions.jsx";
import Typography from "../../components/Typography/Typography.jsx";
import TablesHeader from "../../components/TablesHeader/TablesHeader.jsx";
import TableRowHeader from "../../components/TableRowHeader/TableRowHeader.jsx";
import DeleteModal from "../../components/DeleteModal/DeleteModal.jsx";
import "./ExpensesPage.scss";

const ExpensesPage = () => {
  const navigate = useNavigate();
  const goToAddExpense = () => navigate("/expenses/form/add");
  const [expenses, setExpenses] = useState(0);

  const searchKeys = [
    "description",
    "category",
    "amount",
    "date",
    "recurrence",
  ];
  const { searchString, setSearchString, filteredArray } = useSearch(
    expenses,
    searchKeys,
  );

  useEffect(() => {
    setSearchString("");
  }, []);

  if (!expenses || expenses.length === 0) {
    return <p>No expenses available.</p>;
  }

  const headers = [
    { label: "DESCRIPTION", key: "description", flex: 1 },
    { label: "CATEGORY", key: "category", flex: 1 },
    { label: "AMOUNT", key: "amount", flex: 1 },
    { label: "DATE", key: "date", flex: 1 },
    { label: "RECURRENCE", key: "recurrence", flex: 1 },
  ];

  const {
    modalOpen,
    deleteItem,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
  } = useDeleteModal("expenses");

  return (
    <main className="expenses">
      <TablesHeader
        headerText="Expenses"
        buttonText="+ Add Expense"
        onButtonClick={goToAddExpense}
        searchString={searchString}
        setSearchString={setSearchString}
      />
      <TableRowHeader headers={headers} data={expenses} setData={setExpenses} />
      {Array.isArray(filteredArray) &&
        filteredArray.map((expense) => (
          <TableCard key={expense.description} className="expense-table__card">
            <TableCardField
              label="DESCRIPTION"
              className="expense-table__description"
            >
              <Typography variant="p2" className="card__value-text">
                {expense.description}
              </Typography>
            </TableCardField>

            <TableCardField
              label="CATEGORY"
              className="expense-table__category"
            >
              <Typography variant="p2" className="card__value-text">
                {expense.category}
              </Typography>
            </TableCardField>

            <TableCardField label="AMOUNT" className="expense-table__amount">
              <Typography variant="p2" className="card__value-text">
                {expense.amount}
              </Typography>
            </TableCardField>

            <TableCardField label="DATE" className="expense-table__date">
              <Typography variant="p2" className="card__value-text">
                {expense.date}
              </Typography>
            </TableCardField>

            <TableCardField
              label="RECURRENCE"
              className="expense-table__recurrence"
            >
              <Typography variant="p2" className="card__value-text">
                {expense.recurrence}
              </Typography>
            </TableCardField>

            <TableCardActions
              editTo={`/expenses/form/${expense.id}/edit`}
              onDelete={() => openDeleteModal(expense)}
              className="expense-table__actions"
            />
          </TableCard>
        ))}
      ;
      {modalOpen && deleteItem && (
        <DeleteModal
          deleteItem={deleteItem.description}
          variant="expenses"
          onCancel={closeDeleteModal}
          onConfirm={confirmDelete}
        />
      )}
    </main>
  );
};

export default ExpensesPage;
