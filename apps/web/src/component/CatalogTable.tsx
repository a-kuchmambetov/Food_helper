"use client";

import { useEffect, useState } from "react";
import type { CatalogData } from "../types/DbTypes.ts";
import type { Filters } from "../types/Filters.ts";
import Button from "./Button";
import Dropdown from "./CatalogTable/Dropdown";
import MultiDropdown from "./CatalogTable/MultiDropdown";
import SearchBar from "./CatalogTable/SearchBar";
import Table from "./CatalogTable/Table";

interface CatalogTableProps {
  filters: Filters;
  data: CatalogData[];
  onClick: (userFilters: Filters) => void;
}
const defInput: Filters = {
  dishName: "",
  categories: [],
  tastes: [],
  cookingTime: 9999,
  cookingDifficulty: [],
};

const USERFILTERS_STORAGE_KEY = "user_filters";

function CatalogTable({ filters, data, onClick }: CatalogTableProps) {
  const [input, setInput] = useState(() => {
    const saved =
      typeof window === "undefined"
        ? null
        : localStorage.getItem(USERFILTERS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : defInput;
  });

  useEffect(() => {
    localStorage.setItem(USERFILTERS_STORAGE_KEY, JSON.stringify(input));
  }, [input]);

  const handleChangeSingle = (field: string, value: string | number) => {
    setInput((prev: Filters) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleChangeMulti = (field: string, value: (string | number)[]) => {
    setInput((prev: Filters) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="container">
      <h2 className="font-body text-lg leading-7 font-semibold text-primary">
        Recipes
      </h2>
      <p className="mb-5 font-body text-sm leading-tight font-normal text-tertiary">
        Let us help you choose what suits your needs.
      </p>
      <div className="flex flex-row flex-nowrap items-end justify-start space-x-4 rounded-t-lg border-2 border-zinc-700 p-4 shadow-md max-sm:flex-wrap max-sm:justify-between max-sm:space-y-1 max-sm:space-x-2">
        <SearchBar
          value={input.dishName}
          onChange={(value) => handleChangeSingle("dishName", value)}
        />
        <MultiDropdown
          label={"Category"}
          listValues={(filters.categories ?? []).map((e) => ({
            label: e,
            value: e,
          }))}
          values={input.categories}
          onChange={(value) => handleChangeMulti("categories", value)}
        />
        <MultiDropdown
          label="Taste"
          listValues={(filters.tastes ?? []).map((e) => ({
            label: e,
            value: e,
          }))}
          values={input.tastes}
          onChange={(value) => handleChangeMulti("tastes", value)}
        />
        <Dropdown
          label="Cooking time"
          listValues={[
            { label: "All", value: 9999 },
            { label: "< 30 min", value: 30 },
            { label: "< 60 min", value: 60 },
            { label: "< 90 min", value: 90 },
          ]}
          value={input.cookingTime}
          onChange={(value) => handleChangeSingle("cookingTime", value)}
        />
        <MultiDropdown
          label="Cooking difficulty"
          listValues={[
            { label: "Easy", value: 1 },
            { label: "Medium", value: 2 },
            { label: "Hard", value: 3 },
          ]}
          values={input.cookingDifficulty}
          onChange={(value) => handleChangeMulti("cookingDifficulty", value)}
        />
        <div className="flex flex-grow-1 flex-row justify-end space-y-0 space-x-2 max-md:mt-1 max-md:flex-grow-0 max-md:flex-col max-md:space-y-1 max-md:space-x-0 max-sm:flex-row max-sm:space-y-0 max-sm:space-x-2">
          <Button
            label="Clear all"
            onClick={() => {
              setInput(defInput);
              onClick(defInput);
            }}
          />
          <Button label="Search" onClick={() => onClick(input)} />
        </div>
      </div>
      <Table data={data} />
    </div>
  );
}
export default CatalogTable;
