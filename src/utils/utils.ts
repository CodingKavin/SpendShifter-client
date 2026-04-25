export const sortArrOfObj = <T>(arr: T[], sortBy: keyof T, ascending: boolean = true): T[] => {
  // Supports numbers, strings, and dates. Assumes no mixed data types.

  //using shallow copy of array because .sort mutates
  return [...arr].sort((a, b) => {
    const valA = a[sortBy] as any;
    const valB = b[sortBy] as any;

    if (valA === null || valA === undefined) return 1;
    if (valB === null || valB === undefined) return -1;

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
    const dateA = new Date(valA as any);
    const dateB = new Date(valB as any);

    if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime()) && (typeof valA === 'string' || valA instanceof Date)) {
      return ascending
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    }

    // Handle strings
    if (typeof valA === "string" && typeof valB === "string") {
      return ascending 
        ? valA.localeCompare(valB, undefined, {numeric: true, sensitivity: 'base'}) 
        : valB.localeCompare(valA, undefined, {numeric: true, sensitivity: 'base'});
    }

    return 0;
  });
};
