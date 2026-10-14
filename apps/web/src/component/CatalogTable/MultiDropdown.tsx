"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "@untitledui/icons";

interface DropdownOption {
  label: string;
  value: string | number;
}

interface MultiDropdownProps {
  label: string;
  listValues: DropdownOption[];
  values: (string | number)[];
  onChange: (value: (string | number)[]) => void;
}

function MultiDropdown({
  label = "",
  listValues = [],
  values = [],
  onChange,
}: MultiDropdownProps) {
  const [open, setOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (label: string | number) => {
    let newSelected: (string | number)[];
    if (values.includes(label)) {
      newSelected = values.filter((n) => n !== label);
    } else {
      newSelected = [...values, label];
    }
    onChange(newSelected);
  };
  const displayValue =
    values.length === 0 || values.length === listValues.length
      ? "All"
      : values.length === 1
        ? listValues.find((e) => e.value === values[0])?.label
        : `${values.length} selected`;

  return (
    <div className="relative w-50" ref={dropdownRef}>
      <label className="mb-1 block text-sm text-gray-300">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between rounded-lg border border-zinc-800 bg-transparent px-4 py-2 transition focus:outline-none ${
          open ? "ring-2 ring-zinc-700" : ""
        }`}
      >
        <span className="truncate text-left text-base text-white">
          {displayValue}
        </span>
        <ChevronDown aria-hidden="true" className="h-5 w-5 text-zinc-300" />
      </button>
      {open && (
        <div className="custom-scrollbar absolute left-0 z-10 mt-2 max-h-60 w-full min-w-35 space-y-1 overflow-y-auto rounded-lg border border-neutral-800 bg-zinc-900 p-1 py-2 shadow-xl">
          {listValues.map((item) => (
            <div
              key={item.value}
              onClick={() => handleSelect(item.value)}
              className={`flex cursor-pointer items-center rounded-lg px-4 py-2 transition hover:bg-active ${values.includes(item.value) ? "bg-gray-700" : ""}`}
            >
              {values.includes(item.value) && (
                <input
                  type="checkbox"
                  checked={values.includes(item.value)}
                  readOnly
                  className="mr-2 accent-purple-400"
                  tabIndex={-1}
                  aria-label={`Select ${item.label}`}
                />
              )}
              <span className="font-medium text-white">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MultiDropdown;
