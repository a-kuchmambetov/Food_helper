"use client";

import { useRouter } from "next/navigation";
import type { CatalogData } from "../../types/DbTypes";
import TableRow from "./TableRow";

interface TableProps {
  data: Array<CatalogData>;
}

const maxNumOfEmptyRows = 6;

function Table({ data }: TableProps) {
  // Inside your component:
  const router = useRouter();

  function goToDishPage(dishId: number) {
    router.push(`/dish/${dishId}`);
  }

  return (
    <table className="w-full table-fixed border-collapse text-left">
      <thead>
        <tr className="border-2 border-t-0 border-zinc-700 text-nowrap max-md:text-wrap">
          <th className="px-6 py-3 text-sm text-zinc-400">Dish name</th>
          <th className="w-[10%] px-6 py-3 text-sm text-zinc-400 max-xl:w-[15%]">
            Category
          </th>
          <th className="w-[16%] px-6 py-3 text-sm text-zinc-400 max-xl:w-[20%] max-md:w-[12.5%]">
            Taste
          </th>
          <th className="w-[12.5%] px-6 py-3 text-center text-sm text-wrap text-zinc-400 max-sm:w-[20%]">
            Cooking time
          </th>
          <th className="w-[15%] px-6 py-3 text-center text-sm text-wrap text-zinc-400 max-xs:w-[15%] max-sm:w-[17.5%]">
            Cooking difficulty
          </th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 &&
          data.map((e) => (
            <TableRow key={e.id} data={e} onClick={() => goToDishPage(e.id)} />
          ))}
        {data.length === 0 && (
          <tr key={`empty-row-0`} className="border-2 border-zinc-700">
            <td
              colSpan={5}
              className="px-6 py-10 text-center text-base font-medium text-gray-200"
            >
              No dishes found. Please try changing the filters or other name.
            </td>
          </tr>
        )}

        {(data.length < 6 || data === null) &&
          Array.from({
            length:
              (data.length === 0 ? maxNumOfEmptyRows - 1 : maxNumOfEmptyRows) -
              data.length,
          }).map((_, idx) => (
            <tr key={`empty-row-${idx}`} className="border-2 border-zinc-700">
              <td
                colSpan={5}
                className="h-[91.5px] px-6 py-11 text-sm leading-tight font-medium text-white"
              />
            </tr>
          ))}
      </tbody>
    </table>
  );
}

export default Table;
