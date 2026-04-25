import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSearch } from "./useSearch";

describe("useSearch Hook", () => {
  const mockData = [
    { id: "1", description: "Coffee", category: "Food", amount: 5.50 },
    { id: "2", description: "Rent", category: "Housing", amount: 1200 },
    { id: "3", description: "Refund", category: "Misc", amount: 0 },
  ];

  const keys: (keyof typeof mockData[0])[] = ["description", "category", "amount"];

  it("should return the full array when searchString is empty", () => {
    const { result } = renderHook(() => useSearch(mockData, keys));
    
    expect(result.current.filteredArray).toHaveLength(3);
    expect(result.current.filteredArray).toEqual(mockData);
  });

  it("should filter results based on a string match (case-insensitive)", () => {
    const { result } = renderHook(() => useSearch(mockData, keys));

    act(() => {
      result.current.setSearchString("COFFEE");
    });

    expect(result.current.filteredArray).toHaveLength(1);
    expect(result.current.filteredArray[0]!.description).toBe("Coffee");
  });

  it("should find items based on numerical values (including zero)", () => {
    const { result } = renderHook(() => useSearch(mockData, keys));

    act(() => {
      result.current.setSearchString("0");
    });

    expect(result.current.filteredArray).toContainEqual(mockData[1]);
    expect(result.current.filteredArray).toContainEqual(mockData[2]);
    expect(result.current.filteredArray).toHaveLength(2);
  });

  it("should return an empty array if no matches are found", () => {
    const { result } = renderHook(() => useSearch(mockData, keys));

    act(() => {
      result.current.setSearchString("Non-existent item");
    });

    expect(result.current.filteredArray).toHaveLength(0);
  });

  it("should trim whitespace from the search string", () => {
    const { result } = renderHook(() => useSearch(mockData, keys));

    act(() => {
      result.current.setSearchString("  rent  ");
    });

    expect(result.current.filteredArray).toHaveLength(1);
    expect(result.current.filteredArray[0]!.description).toBe("Rent");
  });
});