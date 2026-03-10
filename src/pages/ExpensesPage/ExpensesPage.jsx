import { useNavigate } from "react-router-dom";
import { useSearch } from "../../hooks/useSearch.js";
import { useEffect, useState } from "react";
import { useDeleteModal } from "../../hooks/useDeleteModal.js";
import api from "../../utils/axios.js";
import TableCard from "../../components/TableCard/TableCard.jsx";
import TableCardField from "../../components/TableCard/TableCardField.jsx";
import TableCardActions from "../../components/TableCard/TableCardActions.jsx";
import Typography from "../../components/Typography/Typography.jsx";
import TablesHeader from "../../components/TablesHeader/TablesHeader.jsx";
import TableRowHeader from "../../components/TableRowHeader/TableRowHeader.jsx";
import DeleteModal from "../../components/DeleteModal/DeleteModal.jsx";
import Button from "../../components/Button/Button.jsx";
import "./ExpensesPage.scss";

const ExpensesPage = () => {
  const navigate = useNavigate();
  const goToAddExpense = () => navigate("/expenses/form/add");
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/expenses");
      setExpenses(response.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to load expenses",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchString("");
    fetchExpenses();
  }, []);

  const {
    modalOpen,
    deleteItem,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
  } = useDeleteModal("expenses", setExpenses);

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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredArray]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(filteredArray)
    ? filteredArray.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  const totalPages = Math.ceil(filteredArray.length / itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  if (loading)
    return (
      <p style={{ display: "flex", justifyContent: "center" }}>Loading...</p>
    );

  if (error)
    return <p style={{ display: "flex", justifyContent: "center" }}>{error}</p>;

  const headers = [
    { label: "DESCRIPTION", key: "description", flex: 1 },
    { label: "CATEGORY", key: "category", flex: 1 },
    { label: "AMOUNT", key: "amount", flex: 1 },
    { label: "DATE", key: "date", flex: 1 },
    { label: "RECURRENCE", key: "recurrence", flex: 1 },
  ];

  if (!expenses || expenses.length === 0) {
    return (
      <div className="expenses">
        <TablesHeader
          headerText="Expenses"
          buttonText="+ Add Expense"
          onButtonClick={goToAddExpense}
          searchString={searchString}
          setSearchString={setSearchString}
          disabled={loading}
        />
        <TableRowHeader
          headers={headers}
          data={expenses}
          setData={setExpenses}
        />
        <p style={{ display: "flex", justifyContent: "center" }}>
          No expenses available.
        </p>
      </div>
    );
  }

  return (
    <div className="expenses">
      <TablesHeader
        headerText="Expenses"
        buttonText="+ Add Expense"
        onButtonClick={goToAddExpense}
        searchString={searchString}
        setSearchString={setSearchString}
        disabled={loading}
      />
      <TableRowHeader headers={headers} data={expenses} setData={setExpenses} />
      {Array.isArray(currentItems) &&
        currentItems.map((expense) => (
          <TableCard key={expense.id} className="expense-table__card">
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
                {`$${Number(expense.amount).toFixed(2)}`}
              </Typography>
            </TableCardField>

            <TableCardField label="DATE" className="expense-table__date">
              <Typography variant="p2" className="card__value-text">
                {expense.date.split("T")[0]}
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
      {modalOpen && deleteItem && (
        <DeleteModal
          deleteItem={deleteItem.description}
          variant="expenses"
          onCancel={closeDeleteModal}
          onConfirm={confirmDelete}
        />
      )}
      <nav className="expenses__pagination">
        <Button
          variant="primary"
          className="expenses__btn"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </Button>

        <div className="expenses__pagination-controls">
          <Button
            className="expenses__btn-pagination"
            variant="secondary"
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            Prev
          </Button>
          <Typography variant="p2" className="expenses__page-indicator">
            Page {currentPage} of {totalPages || 1}
          </Typography>
          <Button
            className="expenses__btn-pagination"
            variant="secondary"
            onClick={handleNext}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default ExpensesPage;
