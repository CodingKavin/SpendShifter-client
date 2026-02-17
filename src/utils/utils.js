export const sortArrOfObj = (arr, sortBy, ascending = true) => {
    //only supports number and string data types and no mixed data types for the sortBy key's values
    return [...arr].sort((a, b) => { //shallow copy because .sort mutates array
        const valA = a[sortBy];
        const valB = b[sortBy];

        // Handle numbers
        if (typeof valA === "number" && typeof valB === "number") {
            return ascending ? valA - valB : valB - valA;
        }

        // Handle strings
        if (typeof valA === "string" && typeof valB === "string") {
            return ascending
                ? valA.localeCompare(valB)
                : valB.localeCompare(valA);
        }

        return 0;
    });
};
