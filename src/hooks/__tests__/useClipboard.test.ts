import { renderHook, act, waitFor } from "@testing-library/react";
import { useClipboard } from "../useClipboard";

// Mock clipboard API
const mockWriteText = vi.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

describe("useClipboard", () => {
  beforeEach(() => {
    mockWriteText.mockClear();
  });

  it("should copy text to clipboard successfully", async () => {
    mockWriteText.mockResolvedValue(undefined);
    const { result } = renderHook(() => useClipboard({ timeout: 1000 }));

    expect(result.current.copied).toBe(false);
    expect(result.current.error).toBe(null);

    await act(async () => {
      await result.current.copy("test text");
    });

    expect(mockWriteText).toHaveBeenCalledWith("test text");
    expect(result.current.copied).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it("should reset copied state after timeout", async () => {
    mockWriteText.mockResolvedValue(undefined);
    const { result } = renderHook(() => useClipboard({ timeout: 100 }));

    await act(async () => {
      await result.current.copy("test text");
    });

    expect(result.current.copied).toBe(true);

    await waitFor(
      () => {
        expect(result.current.copied).toBe(false);
      },
      { timeout: 200 },
    );
  });

  it("should set error state when copy fails", async () => {
    mockWriteText.mockRejectedValue(new Error("Clipboard error"));
    const { result } = renderHook(() => useClipboard({ timeout: 1000 }));

    await act(async () => {
      await result.current.copy("test text");
    });

    expect(result.current.copied).toBe(false);
    expect(result.current.error).toBe("Failed to copy to clipboard");
  });

  it("should reset error state after timeout", async () => {
    mockWriteText.mockRejectedValue(new Error("Clipboard error"));
    const { result } = renderHook(() => useClipboard({ timeout: 100 }));

    await act(async () => {
      await result.current.copy("test text");
    });

    expect(result.current.error).toBe("Failed to copy to clipboard");

    await waitFor(
      () => {
        expect(result.current.error).toBe(null);
      },
      { timeout: 200 },
    );
  });

  it("should clear previous timeout when copying again", async () => {
    mockWriteText.mockResolvedValue(undefined);
    const { result } = renderHook(() => useClipboard({ timeout: 1000 }));

    await act(async () => {
      await result.current.copy("first text");
    });

    expect(result.current.copied).toBe(true);

    // Copy again before timeout
    await act(async () => {
      await result.current.copy("second text");
    });

    expect(result.current.copied).toBe(true);
    expect(mockWriteText).toHaveBeenCalledTimes(2);
    expect(mockWriteText).toHaveBeenLastCalledWith("second text");
  });
});
