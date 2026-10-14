"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "@untitledui/icons";

interface DropdownProps {
  label: string;
  listValues: { label: string; value: number }[];
  value: number;
  onChange: (value: number) => void;
}

function Dropdown({
  label = "",
  listValues = [],
  value = 0,
  onChange,
}: DropdownProps) {
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

  const handleSelect = (val: number) => {
    onChange(val);
    // setOpen(false);
  };

  const selected = listValues.find((item) => item.value === value);

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
          {selected ? selected.label : ""}
        </span>
        <ChevronDown aria-hidden="true" className="h-5 w-5 text-zinc-300" />
      </button>
      {open && (
        <div className="custom-scrollbar absolute left-0 mt-2 max-h-60 w-full space-y-1 overflow-y-auto rounded-2xl border border-neutral-800 bg-zinc-900 p-1 py-2 shadow-xl">
          {listValues.map((item) => (
            <div
              key={item.value}
              onClick={() => handleSelect(item.value)}
              className={`flex cursor-pointer items-center rounded-xl px-4 py-2 transition hover:bg-active ${item.value === value ? "bg-gray-700" : ""} `}
            >
              <span className="font-medium text-white">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
