import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../hooks/useSearch.js";
import { useEffect, useState } from "react";
import Iconography from "../Iconography/Iconography";
import TableCard from "../TableCard/TableCard.jsx";
import TableCardField from "../TableCard/TableCardField.jsx";
import TableCardActions from "../TableCard/TableCardActions.jsx";
import Typography from "../Typography/Typography.jsx";
import TablesHeader from "../TablesHeader/TablesHeader.jsx";
import TableRowHeader from "../TableRowHeader/TableRowHeader.jsx";
import "./ExpensesPage.scss";

const ExpensesPage = () => {
  const navigate = useNavigate();
  const goToAddExpense = () => navigate("/expenses/form/add");

  const searchKeys = [
    "warehouse_name",
    "address",
    "contact_name",
    "contact_email",
    "contact_phone",
  ];
  const { searchString, setSearchString, filteredArray } = useSearch(
    warehouses,
    searchKeys,
  );

  useEffect(() => {
    setSearchString("");
  }, []);

  if (!warehouses || warehouses.length === 0) {
    return <p>No warehouses available.</p>;
  }

  const headers = [
    { label: "DESCRIPTION", key: "description", flex: 1 },
    { label: "CATEGORY", key: "category", flex: 1 },
    { label: "AMOUNT", key: "amount", flex: 1 },
    { label: "DATE", key: "date", flex: 1 },
    { label: "RECURRENCE", key: "recurrence", flex: 1 },
  ];

  return (
    <main>
      <TablesHeader
        headerText="Expenses"
        buttonText="+ Add Expense"
        onButtonClick={goToAddExpense}
        searchString={searchString}
        setSearchString={setSearchString}
      />
      <TableRowHeader headers={headers} data={expenses} setData={setExpenses} />
    </main>
  );
};
