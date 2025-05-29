import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "untitledui-js/react";

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
    <div className="w-50 relative" ref={dropdownRef}>
      <label className="block text-sm text-gray-300 mb-1">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center justify-between w-full px-4 py-2 bg-transparent border border-zinc-800 rounded-lg focus:outline-none transition ${
          open ? "ring-2 ring-zinc-700" : ""
        }`}
      >
        <span className="text-base text-white truncate text-left">
          {displayValue}
        </span>
        <ChevronDown className="w-5 h-5 text-zinc-300" />
      </button>
      {open && (
        <div className="absolute z-10 left-0 mt-2 w-full min-w-35 bg-zinc-900 rounded-lg shadow-xl py-2 max-h-60 overflow-y-auto border border-neutral-800 custom-scrollbar p-1 space-y-1">
          {listValues.map((item) => (
            <div
              key={item.value}
              onClick={() => handleSelect(item.value)}
              className={`flex items-center px-4 py-2 cursor-pointer hover:bg-bg-active rounded-lg transition
                ${values.includes(item.value) ? "bg-gray-700" : ""}`}
            >
              {values.includes(item.value) && (
                <input
                  type="checkbox"
                  checked={values.includes(item.value)}
                  readOnly
                  className="accent-purple-400 mr-2"
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
