"use client";

import * as React from "react";
import { ChevronDownIcon, CheckIcon, SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DropdownItem {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
  groupId?: string;
}

export interface DropdownGroup {
  id: string;
  label: string;
}

export interface DropdownProps {
  items: DropdownItem[];
  groups?: DropdownGroup[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
  placeholder?: string;
  searchable?: boolean;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  panelClassName?: string;
}

export function Dropdown({
  items,
  groups,
  selectedId,
  onSelect,
  placeholder = "Select an option",
  searchable = false,
  disabled = false,
  className,
  triggerClassName,
  panelClassName,
}: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  const selectedItem = items.find((item) => item.id === selectedId);

  // Filter items based on search query
  const filteredItems = React.useMemo(() => {
    if (!searchQuery) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query),
    );
  }, [items, searchQuery]);

  // Get enabled items for keyboard navigation
  const enabledItems = React.useMemo(
    () => filteredItems.filter((item) => !item.disabled),
    [filteredItems],
  );

  // Group items by group ID
  const groupedItems = React.useMemo(() => {
    if (!groups || groups.length === 0) {
      return [{ group: null, items: filteredItems }];
    }

    const grouped: { group: DropdownGroup | null; items: DropdownItem[] }[] =
      [];
    const ungroupedItems = filteredItems.filter((item) => !item.groupId);

    if (ungroupedItems.length > 0) {
      grouped.push({ group: null, items: ungroupedItems });
    }

    groups.forEach((group) => {
      const groupItems = filteredItems.filter(
        (item) => item.groupId === group.id,
      );
      if (groupItems.length > 0) {
        grouped.push({ group, items: groupItems });
      }
    });

    return grouped;
  }, [groups, filteredItems]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  React.useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Reset highlighted index when filtered items change
  React.useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchQuery]);

  // Scroll highlighted item into view
  React.useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedItem = enabledItems[highlightedIndex];
      if (highlightedItem) {
        const itemElement = listRef.current.querySelector(
          `[data-item-id="${highlightedItem.id}"]`,
        );
        if (itemElement) {
          itemElement.scrollIntoView({ block: "nearest" });
        }
      }
    }
  }, [highlightedIndex, enabledItems]);

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchQuery("");
      setHighlightedIndex(-1);
    }
  };

  const handleSelect = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item?.disabled) return;

    onSelect(id);
    setIsOpen(false);
    setSearchQuery("");
    setHighlightedIndex(-1);
    triggerRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (highlightedIndex >= 0 && enabledItems[highlightedIndex]) {
          handleSelect(enabledItems[highlightedIndex].id);
        }
        break;

      case "Escape":
        event.preventDefault();
        setIsOpen(false);
        setSearchQuery("");
        setHighlightedIndex(-1);
        triggerRef.current?.focus();
        break;

      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) =>
            prev < enabledItems.length - 1 ? prev + 1 : 0,
          );
        }
        break;

      case "ArrowUp":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : enabledItems.length - 1,
          );
        }
        break;

      case "Home":
        event.preventDefault();
        if (isOpen) {
          setHighlightedIndex(0);
        }
        break;

      case "End":
        event.preventDefault();
        if (isOpen) {
          setHighlightedIndex(enabledItems.length - 1);
        }
        break;

      case "Tab":
        if (isOpen) {
          setIsOpen(false);
          setSearchQuery("");
          setHighlightedIndex(-1);
        }
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-block w-full", className)}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="dropdown-label"
        className={cn(
          "border-input data-[placeholder]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50",
          "flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm",
          "shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "dark:bg-input/30 dark:hover:bg-input/50",
          triggerClassName,
        )}
      >
        <span
          className={cn("truncate", !selectedItem && "text-muted-foreground")}
        >
          {selectedItem?.label ?? placeholder}
        </span>
        <ChevronDownIcon
          className={cn(
            "size-4 shrink-0 opacity-50 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className={cn(
            "bg-popover text-popover-foreground absolute z-50 mt-1 w-full min-w-[8rem] overflow-hidden rounded-md border shadow-md",
            "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2",
            panelClassName,
          )}
          role="listbox"
          aria-activedescendant={
            highlightedIndex >= 0 && enabledItems[highlightedIndex]
              ? `dropdown-item-${enabledItems[highlightedIndex].id}`
              : undefined
          }
        >
          {/* Search Input */}
          {searchable && (
            <div className="border-border border-b p-2">
              <div className="relative">
                <SearchIcon className="text-muted-foreground absolute left-2 top-1/2 size-4 -translate-y-1/2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className={cn(
                    "placeholder:text-muted-foreground w-full rounded-sm bg-transparent py-1.5 pl-8 pr-2 text-sm outline-none",
                    "focus:ring-ring/50 focus:ring-2",
                  )}
                  aria-label="Search items"
                />
              </div>
            </div>
          )}

          {/* Items List */}
          <ul
            ref={listRef}
            className="max-h-60 overflow-y-auto p-1"
            role="group"
          >
            {filteredItems.length === 0 ? (
              <li className="text-muted-foreground px-2 py-4 text-center text-sm">
                No results found
              </li>
            ) : (
              groupedItems.map(({ group, items: groupItems }, groupIndex) => (
                <React.Fragment key={group?.id ?? "ungrouped"}>
                  {/* Group Header */}
                  {group && (
                    <>
                      {groupIndex > 0 && (
                        <li
                          className="bg-border -mx-1 my-1 h-px"
                          role="separator"
                        />
                      )}
                      <li
                        className="text-muted-foreground px-2 py-1.5 text-xs font-medium"
                        role="presentation"
                      >
                        {group.label}
                      </li>
                    </>
                  )}

                  {/* Group Items */}
                  {groupItems.map((item) => {
                    const itemIndex = enabledItems.findIndex(
                      (i) => i.id === item.id,
                    );
                    const isHighlighted = itemIndex === highlightedIndex;
                    const isSelected = item.id === selectedId;

                    return (
                      <li
                        key={item.id}
                        id={`dropdown-item-${item.id}`}
                        data-item-id={item.id}
                        role="option"
                        aria-selected={isSelected}
                        aria-disabled={item.disabled}
                        onClick={() => handleSelect(item.id)}
                        onMouseEnter={() => {
                          if (!item.disabled) {
                            setHighlightedIndex(itemIndex);
                          }
                        }}
                        className={cn(
                          "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none",
                          isHighlighted &&
                            !item.disabled &&
                            "bg-accent text-accent-foreground",
                          item.disabled && "pointer-events-none opacity-50",
                          !item.disabled && "cursor-pointer",
                        )}
                      >
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.description && (
                          <span className="text-muted-foreground text-xs truncate">
                            {item.description}
                          </span>
                        )}
                        {isSelected && (
                          <CheckIcon className="size-4 shrink-0" />
                        )}
                      </li>
                    );
                  })}
                </React.Fragment>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Dropdown;
