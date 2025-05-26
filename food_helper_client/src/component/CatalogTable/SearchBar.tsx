import { SearchMd } from "untitledui-js/react";

interface SearchBarProps {
  value?: string;
  onChange: (value: string) => void;
}

function SearchBar({ value = "", onChange }: SearchBarProps) {
  return (
    <div className="flex flex-col min-w-20">
      <label className="text-gray-300 text-sm font-['Inter'] leading-tight mb-1">
        Search for recipe
      </label>
      <div className="relative w-full max-w-xs">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchMd size={20} className="mr-1" stroke={"#94969C"} />
        </span>
        <input
          className="pl-10 pr-3 py-2 w-full rounded-lg border border-zinc-800 focus:outline-none transition focus:ring-2 focus:ring-zinc-700 text-white"
          type="text"
          placeholder="Enter name of the dish"
          value={value}
          onChange={(e) => {
            const val = e.target.value;
            onChange(val);
          }}
        />
      </div>
    </div>
  );
}

export default SearchBar;
