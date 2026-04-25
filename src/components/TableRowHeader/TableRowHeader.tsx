import Iconography from "../Iconography/Iconography";
import Typography from "../Typography/Typography";
import { sortArrOfObj } from "../../utils/utils";
import { useState, type FC, type Dispatch, type SetStateAction } from "react";
import "./TableRowHeader.scss";

/* 
* Receives an array of objects for table headers with the label, key(get request object properties) and flex ratio and returns the row header with the sort 
  attached and an appended final column called ACTIONS. 
* Also passes an onSort function as prop which will be called with header as parameter for the sort function
  of each row header as defined in the parent component.
* Do not pass ACTIONS column header in the array. Currently ACTIONS is set to have a flex ratio of 0.75. Can be updated when needed.
* EXAMPLE HEADERS ARRAY
const headers = [
    { label: "WAREHOUSE", key: "warehouse_name", flex: 1.25 },
    { label: "ADDRESS", key: "address", flex: 1 },
    { label: "CONTACT NAME", key: "contact_name", flex: 1 },
    { label: "CONTACT INFORMATION", key: "contact_phone", flex: 1.5 }
];
*/

export interface TableHeader {
  label: string;
  key: string;
  flex:number;
}

interface TableRowHeaderProps<T> {
  headers: TableHeader[];
  data: T[];
  setData: Dispatch<SetStateAction<T[]>>;
}

interface SortState {
  column: string | null;
  ascending: boolean;
}

const TableRowHeader = <T extends Record<string, any>>({ headers = [], data = [], setData }: TableRowHeaderProps<T>) => {
  const [sortState, setSortState] = useState<SortState>({
    column: null,
    ascending: true,
  });

  const onSort = (key: string) => {
    const ascending = sortState.column === key ? !sortState.ascending : true;
    const sortedArray = sortArrOfObj(data, key, ascending);
    setData(sortedArray);
    setSortState({ column: key, ascending });
  };

  return (
    <div className="table-row-header">
      {headers.map(({ label, key, flex }, index) => (
        <div
          key={index}
          className="table-row-header__cell"
          style={{ flex: flex }}
        >
          <span className="table-row-header__label">
            <Typography variant="h4">{label}</Typography>
          </span>
          <button
            type="button"
            className="table-row-header__sort-button"
            aria-label={`Sort by ${label}`}
            onClick={() => onSort(key)}
          >
            <Iconography name="sort" className="table-row-header__sort-icon" />
          </button>
        </div>
      ))}

      <div
        className="table-row-header__cell table-row-header__cell--actions"
        style={{ flex: 0.75 }}
      >
        <span className="table-row-header__label table-row-header__label--actions">
          <Typography variant="h4">ACTIONS</Typography>
        </span>
      </div>
    </div>
  );
};

export default TableRowHeader;
