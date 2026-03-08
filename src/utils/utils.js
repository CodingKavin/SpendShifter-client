export const sortArrOfObj = (arr, sortBy, ascending = true) => {
  // Supports numbers, strings, and dates. Assumes no mixed data types.

  //using shallow copy of array because .sort mutates
  return [...arr].sort((a, b) => {
    const valA = a[sortBy];
    const valB = b[sortBy];

    // Handle numbers
    if (typeof valA === "number" && typeof valB === "number") {
      return ascending ? valA - valB : valB - valA;
    }

    // Handle Date objects
    if (valA instanceof Date && valB instanceof Date) {
      return ascending
        ? valA.getTime() - valB.getTime()
        : valB.getTime() - valA.getTime();
    }

    // Handle date strings
    const dateA = new Date(valA);
    const dateB = new Date(valB);

    if (!isNaN(dateA) && !isNaN(dateB)) {
      return ascending
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    }

    // Handle strings
    if (typeof valA === "string" && typeof valB === "string") {
      return ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }

    return 0;
  });
};
