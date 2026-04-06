import { useState, useMemo, type Dispatch, type SetStateAction } from "react";

export const useSearch = <T,>(array: T[] = [], keys: (keyof T)[] = []) => {
    const [searchString, setSearchString] = useState<string>("");

    const filteredArray = useMemo(() => {
        if (!searchString) return array;
        const lowerSearch = searchString.trim().toLowerCase();
        if (!lowerSearch) return array;

        return array.filter(item => keys.some(key => {
            const value = item[key]
            return (value !== null && value !== undefined && String(value).toLowerCase().includes(lowerSearch))
        }));
    }, [array, searchString, keys]);

    return {
        searchString,
        setSearchString: setSearchString as Dispatch<SetStateAction<string>>,
        filteredArray
    };
}