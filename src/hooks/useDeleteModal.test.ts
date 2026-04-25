import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDeleteModal } from "./useDeleteModal";
import api from "../utils/axios";

vi.mock("../utils/axios", () => ({
  default: {
    delete: vi.fn(),
    get: vi.fn(),
  },
}));

describe("useDeleteModal Hook", () => {
  const mockSetData = vi.fn();
  const mockEndpoint = "/test-endpoint";
  const mockItem = { id: "123", name: "Test Item", user_id: "mock-user-123" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useDeleteModal(mockEndpoint, mockSetData));
    
    expect(result.current.modalOpen).toBe(false);
    expect(result.current.deleteItem).toBe(null);
  });

  it("should set the delete item and open the modal", () => {
    const { result } = renderHook(() => useDeleteModal(mockEndpoint, mockSetData));

    act(() => {
      result.current.openDeleteModal(mockItem);
    });

    expect(result.current.deleteItem).toEqual(mockItem);
    expect(result.current.modalOpen).toBe(true);
  });

  it("should successfully delete an item and refresh data", async () => {
    const updatedData = [{ id: "456", name: "Other Item" }];
    (api.delete as any).mockResolvedValue({});
    (api.get as any).mockResolvedValue({ data: updatedData });

    const { result } = renderHook(() => useDeleteModal(mockEndpoint, mockSetData));

    act(() => {
      result.current.openDeleteModal(mockItem);
    });

    await act(async () => {
      await result.current.confirmDelete();
    });

    expect(api.delete).toHaveBeenCalledWith(`${mockEndpoint}/123`);
    expect(api.get).toHaveBeenCalledWith(mockEndpoint);
    expect(mockSetData).toHaveBeenCalledWith(updatedData);
    expect(result.current.modalOpen).toBe(false);
    expect(result.current.deleteItem).toBe(null);
  });

  it("should handle API errors gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    (api.delete as any).mockRejectedValue(new Error("Network Error"));

    const { result } = renderHook(() => useDeleteModal(mockEndpoint, mockSetData));

    act(() => {
      result.current.openDeleteModal(mockItem);
    });

    await act(async () => {
      await result.current.confirmDelete();
    });

    expect(consoleSpy).toHaveBeenCalledWith("failed to delete item");
    expect(result.current.modalOpen).toBe(false);
    
    consoleSpy.mockRestore();
  });
});