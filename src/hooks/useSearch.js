import { useState, useMemo } from "react";

export const useSearch = (array = [], keys = []) => {
    const [searchString, setSearchString] = useState("");

    const filteredArray = useMemo(() => {
        if (!searchString) return array;

        const lowerSearch = searchString.trim().toLowerCase();

        return array.filter(item => keys.some(key => {
            const value = item[key]
            return (value && String(value).toLowerCase().includes(lowerSearch))
        }));
    }, [array, searchString, keys]);

    return {
        searchString,
        setSearchString,
        filteredArray
    };
}