"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import CatalogTable from "../component/CatalogTable";
import Pagination from "../component/CatalogTable/Pagination";
import type { CatalogData, FilteredCatalogData } from "../types/DbTypes";
import type { Filters } from "../types/Filters";

// Selecting every taste is the same as no taste filter. Returns a copy so React state is not mutated.
function ValidateUserFilters(
  srcFilters: Filters,
  userFilters: Filters,
): Filters {
  if (srcFilters?.tastes?.length === userFilters?.tastes?.length)
    return { ...userFilters, tastes: [] };
  return userFilters;
}

async function GetFiltersFromDB(): Promise<Filters> {
  return api
    .get("/dishes/filters")
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
  includeCount = true as boolean,
): Promise<FilteredCatalogData> {
  return api
    .post("/dishes/filters", userFilters, {
      params: { page, elements, includeCount },
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
    const saved =
      typeof window === "undefined"
        ? null
        : sessionStorage.getItem(PAGINATIONPAGE_STORAGE_KEY);
    return saved ? JSON.parse(saved) : 1;
  });

  // Read through a ref so loading filter options does not trigger another catalog fetch.
  const filtersRef = useRef(filters);
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

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
      includeCount: boolean = true,
    ) => {
      const result = await GetCatalogDataByFilters(
        ValidateUserFilters(filtersRef.current, userFilters),
        page,
        elements,
        includeCount,
      );
      setCatalogData(result.data);
      const newTotalPages = Math.ceil(result.totalCount / elements);
      if (includeCount) setTotalPages(newTotalPages);
      // Reset to page 1 if current page exceeds total pages
      if (includeCount)
        setCurrentPage((page) => (page > newTotalPages ? 1 : page));
    },
    [],
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
    <div className="flex h-full flex-col items-center justify-start p-4 text-white">
      <CatalogTable
        filters={filters}
        data={catalogData || []}
        onClick={(userFilters) =>
          fetchCatalogDataWithFilters(userFilters, currentPage)
        }
      />
      <div className="mt-12 flex w-full items-center justify-center">
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
