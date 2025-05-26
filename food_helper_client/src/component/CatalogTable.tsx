import { useState } from "react";
import SearchBar from "./CatalogTable/SearchBar";
import MultiDropdown from "./CatalogTable/MultiDropdown";
import Button from "./Button";
import Table from "./CatalogTable/Table";

// interface DataRowFromDB {
//   recipeName: string;
//   categories: string[];
//   tastes: string[];
//   cookingTime: number;
//   cookingDifficulty: number;
// }

function CatalogTable() {
  const [input, setInput] = useState({
    recipeName: "",
    categories: [] as string[],
    tastes: [] as string[],
    cookingTime: [] as string[],
    cookingDifficulty: [] as string[],
  });

  const handleChangeSingle = (field: string, value: string) => {
    setInput((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleChangeMulti = (field: string, value: string[]) => {
    setInput((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="container">
      <h2 className="text-primary-900 text-lg font-semibold font-['Inter'] leading-7">
        Recipes
      </h2>
      <p className="text-tertiary-600 text-sm font-normal font-['Inter'] leading-tight mb-5">
        Let us help you choose what suits your needs.
      </p>
      <div className="flex flex-row flex-nowrap max-sm:flex-wrap max-sm:justify-between max-sm:space-y-1 max-sm:space-x-2 items-end justify-start p-4 shadow-md rounded-t-lg border-2 border-zinc-700 space-x-4">
        <SearchBar
          value={input.recipeName}
          onChange={(value) => handleChangeSingle("recipeName", value)}
        />
        <MultiDropdown
          label={"Category"}
          listValues={["Soup", "Dessert", "Main course", "Salad", "Snack"]}
          values={input.categories}
          onChange={(value) => handleChangeMulti("categories", value)}
        />
        <MultiDropdown
          label="Taste"
          listValues={["Sweet", "Sour", "Spicy", "Bitter", "Savory"]}
          values={input.tastes}
          onChange={(value) => handleChangeMulti("tastes", value)}
        />
        <MultiDropdown
          label="Cooking time"
          listValues={["~15 min", "~30 min", "~45 min", "~60 min"]}
          values={input.cookingTime}
          onChange={(value) => handleChangeMulti("cookingTime", value)}
        />
        <MultiDropdown
          label="Cooking difficulty"
          listValues={["Easy", "Medium", "Hard"]}
          values={input.cookingDifficulty}
          onChange={(value) => handleChangeMulti("cookingDifficulty", value)}
        />
        <div className="flex flex-row space-x-2 space-y-0 max-sm:space-x-2 max-sm:space-y-0 max-sm:flex-row max-md:flex-col max-md:space-x-0 max-md:space-y-1 max-md:mt-1 justify-end  max-md:flex-grow-0 flex-grow-1">
          <Button label="Clear all" />
          <Button label="Search" />
        </div>
      </div>
      <Table />
    </div>
  );
}
export default CatalogTable;
