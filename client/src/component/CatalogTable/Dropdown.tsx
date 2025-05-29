import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "untitledui-js/react";

interface Values {
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
}: Values) {
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
    setOpen(false);
  };

  const selected = listValues.find((item) => item.value === value);

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
          {selected ? selected.label : ""}
        </span>
        <ChevronDown className="w-5 h-5 text-zinc-300" />
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-full bg-zinc-900 rounded-2xl shadow-xl py-2 max-h-60 overflow-y-auto border border-neutral-800 custom-scrollbar p-1 space-y-1">
          {listValues.map((item) => (
            <div
              key={item.value}
              onClick={() => handleSelect(item.value)}
              className={`
                flex items-center px-4 py-2 cursor-pointer hover:bg-gray-800 rounded-xl transition
                ${item.value === value ? "bg-neutral-800" : ""}
              `}
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
