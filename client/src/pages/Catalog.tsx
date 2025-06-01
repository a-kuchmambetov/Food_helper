import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import CatalogTable from "../component/CatalogTable";
import Pagination from "../component/CatalogTable/Pagination";

import type { CatalogData, FilteredCatalogData } from "../types/DbTypes";
import type { Filters } from "../types/Filters";

const API_URL = import.meta.env.VITE_API_URL;

function ValidateUserFilters(
  srcFilters: Filters,
  userFilters: Filters
): Filters {
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

async function GetCatalogDataByFilters(
  userFilters: Filters,
  page = 1 as number,
  elements = 6 as number,
  includeCount = true as boolean
): Promise<FilteredCatalogData> {
  return axios({
    method: "post",
    url: API_URL + "/dishes/filters",
    data: {
      ...userFilters,
    },
    params: {
      page: page,
      elements: elements,
      includeCount: includeCount,
    },
  })
    .then((response) => {
      if (response.status === 200)
        return {
          totalCount: response.data.totalCount,
          data: response.data.dishes,
        };
      throw new Error("Failed to fetch data from the server");
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      return { totalCount: 0, data: [] } as FilteredCatalogData; // Return empty object on error
    });
}

const USERFILTERS_STORAGE_KEY = "user_filters";
const PAGINATIONPAGE_STORAGE_KEY = "pagination_page";

function Catalog() {
  const [filters, setFilters] = useState<Filters>({} as Filters); // Constant value for filters from DB. Categories, tastes that need to display for dropdown UI.
  const [catalogData, setCatalogData] = useState<CatalogData[]>([]); // Actaul data about dishes, fetched from DB.
  const [totalPages, setTotalPages] = useState<number>(0); // Total pages for pagination, fetched from DB.
  const [currentPage, setCurrentPage] = useState<number>(() => {
    const saved = sessionStorage.getItem(PAGINATIONPAGE_STORAGE_KEY);
    return saved ? JSON.parse(saved) : 1;
  });

  useEffect(() => {
    GetFiltersFromDB().then(setFilters);
  }, []);
  function handePageChange(page: number) {
    if (page < 1 || page > totalPages) {
      console.warn("Invalid page number:", page);
      return;
    }
    setCurrentPage(page);
    sessionStorage.setItem(PAGINATIONPAGE_STORAGE_KEY, JSON.stringify(page));
  }
  const fetchCatalogDataWithFilters = useCallback(
    async (
      userFilters: Filters,
      page: number = 1,
      elements: number = 6,
      includeCount: boolean = true
    ) => {
      const result = await GetCatalogDataByFilters(
        ValidateUserFilters(filters, userFilters),
        page,
        elements,
        includeCount
      );
      setCatalogData(result.data);
      const newTotalPages = Math.ceil(result.totalCount / elements);
      if (includeCount) setTotalPages(newTotalPages);
      if (currentPage > newTotalPages) setCurrentPage(1); // Reset to page 1 if current page exceeds total pages
      console.log(
        "Catalog data updated. UserFilters:",
        userFilters,
        "; Recived data:",
        result.data
      );
    },
    [filters, currentPage]
  );
  useEffect(() => {
    const savedFilters = localStorage.getItem(USERFILTERS_STORAGE_KEY);
    if (savedFilters) {
      // If user filters exist, fetch filtered data
      const parsedFilters = JSON.parse(savedFilters);
      fetchCatalogDataWithFilters(parsedFilters, currentPage);
    } else {
      // Otherwise, fetch unfiltered data
      fetchCatalogDataWithFilters({} as Filters, currentPage);
    }
  }, [currentPage, fetchCatalogDataWithFilters]);

  return (
    <div className="flex flex-col items-center justify-start h-full text-white p-4 ">
      <CatalogTable
        filters={filters}
        data={catalogData || []}
        onClick={(userFilters) =>
          fetchCatalogDataWithFilters(userFilters, currentPage)
        }
      />
      <div className="flex items-center justify-center w-full mt-12">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handePageChange}
        />
      </div>
    </div>
  );
}

export default Catalog;
