"use client";

import { SearchMd } from "@untitledui/icons";
import { Input } from "@/components/base/input/input";

interface SearchBarProps {
  value?: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value = "", onChange }: SearchBarProps) {
  return (
    <Input
      className="max-w-xs min-w-20"
      label="Search for recipe"
      placeholder="Enter name of the dish"
      icon={SearchMd}
      value={value}
      onChange={onChange}
    />
  );
}
