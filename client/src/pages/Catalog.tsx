import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import CatalogTable from "../component/CatalogTable";

import type { CatalogData } from "../types/DbTypes";
import type { Filters } from "../types/Filters";

const API_URL = import.meta.env.VITE_API_URL;

function FixUserFilters(srcFilters: Filters, userFilters: Filters): Filters {
  if (srcFilters?.tastes?.length === userFilters?.tastes?.length)
    userFilters.tastes = [];
  return userFilters;
}

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
    url: API_URL + "/dishes/filters",
    data: {
      ...filters,
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

  const fetchCatalogDataWithFilters = useCallback(
    async (input: Filters, page: number = 1, elements: number = 6) => {
      const data = await GetCatalogDataWithFilters(
        FixUserFilters(filters, input),
        page,
        elements
      );
      setCatalogData(data);
      console.log(
        "Catalog data updated. UserFilters:",
        filters,
        "; Recived data:",
        data
      );
    },
    [filters]
  );

  useEffect(() => {
    GetFiltersFromDB().then(setFilters);
  }, []);

  useEffect(() => {
    const FILTERS_STORAGE_KEY = "catalog_filters";
    const savedFilters = localStorage.getItem(FILTERS_STORAGE_KEY);
    if (savedFilters) {
      // If user filters exist, fetch filtered data
      const parsedFilters = JSON.parse(savedFilters);
      fetchCatalogDataWithFilters(parsedFilters);
    } else {
      // Otherwise, fetch unfiltered data
      GetCatalogDataFromDB().then(setCatalogData);
    }
  }, [filters, fetchCatalogDataWithFilters]);

  return (
    <div className="flex flex-col items-center justify-start h-full text-white p-4 ">
      <CatalogTable
        filters={filters}
        data={catalogData}
        onClick={(userFilters: Filters) =>
          fetchCatalogDataWithFilters(userFilters)
        }
      />
    </div>
  );
}

export default Catalog;
