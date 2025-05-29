import { useEffect, useState } from "react";
import axios from "axios";
import CatalogTable from "../component/CatalogTable";
import Button from "../component/Button";

import type { CatalogData } from "../types/DbTypes";
import type { Filters } from "../types/Filters";

const API_URL = import.meta.env.VITE_API_URL;

async function GetFiltersFromDB(): Promise<Filters> {
  return axios({
    method: "get",
    url: API_URL + "/dishes/filters",
  })
    .then((response) => {
      if (response.status === 200) return response.data;
      throw new Error("Failed to fetch data from the server");
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      return {} as Filters; // Return empty object on error
    });
}

async function GetCatalogDataFromDB(
  page = 1 as number,
  elements = 6 as number
): Promise<CatalogData[]> {
  return axios({
    method: "get",
    url: API_URL + "/dishes/limited",
    params: {
      page: page,
      elements: elements,
    },
  })
    .then((response) => {
      if (response.status === 200) return response.data;
      throw new Error("Failed to fetch data from the server");
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      return [] as CatalogData[]; // Return empty object on error
    });
}

async function GetCatalogDataWithFilters(
  filters: Filters,
  page = 1 as number,
  elements = 6 as number
): Promise<CatalogData[]> {
  return axios({
    method: "post",
    url: API_URL + "/dishes/filtered",
    data: {
      filters: filters,
    },
    params: {
      page: page,
      elements: elements,
    },
  })
    .then((response) => {
      if (response.status === 200) return response.data;
      throw new Error("Failed to fetch data from the server");
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      return [] as CatalogData[]; // Return empty object on error
    });
}

function Catalog() {
  const [filters, setFilters] = useState<Filters>({} as Filters);
  const [catalogData, setCatalogData] = useState<CatalogData[]>([]);

  useEffect(() => {
    GetFiltersFromDB().then(setFilters);
  }, []);

  useEffect(() => {
    GetCatalogDataFromDB().then(setCatalogData);
  }, []);

  async function fetchCatalogDataWithFilters(
    input: Filters,
    page: number,
    elements: number
  ) {
    const data = await GetCatalogDataWithFilters(input, page, elements);
    setCatalogData(data);
    console.log("Catalog data updated:", catalogData);
  }

  return (
    <div className="flex flex-col items-center justify-start h-full text-white p-4 ">
      <CatalogTable
        filters={filters}
        data={catalogData}
        onClick={(input, page, elements) => fetchCatalogDataWithFilters()}
      />
      <Button label="Refresh Catalog" onClick={fetchCatalogDataWithFilters} />
    </div>
  );
}

export default Catalog;
