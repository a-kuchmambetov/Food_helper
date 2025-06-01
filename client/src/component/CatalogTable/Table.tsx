import { useNavigate } from "react-router-dom";
import type { CatalogData } from "../../types/DbTypes";
import TableRow from "./TableRow";

interface TableProps {
  data: Array<CatalogData>;
}

const maxNumOfEmptyRows = 6;

function Table({ data }: TableProps) {
  // Inside your component:
  const navigate = useNavigate();

  function goToDishPage(dishId: number) {
    navigate(`/dish/${dishId}`);
  }

  return (
    <table className="table-fixed w-full border-collapse text-left">
      <thead>
        <tr className="border-t-0 border-2 border-zinc-700 text-nowrap max-md:text-wrap">
          <th className="px-6 py-3 text-sm text-zinc-400">Dish name</th>
          <th className="w-[10%] max-md:w-[20%] px-6 py-3 text-sm text-zinc-400">
            Category
          </th>
          <th className="w-[25%] max-md:w-[12.5%] px-6 py-3 text-sm text-zinc-400">
            Taste
          </th>
          <th className="w-[12.5%] max-sm:w-[20%] px-6 py-3 text-sm text-zinc-400 text-center text-wrap">
            Cooking time
          </th>
          <th className="w-[12.5%] max-sm:w-[17.5%] px-6 py-3 text-sm text-zinc-400 text-center text-wrap">
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
              className="px-6 py-10 font-medium text-base text-gray-200 text-center"
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
                className="px-6 py-11 h-[91.5px] font-medium leading-tight text-sm text-white"
              />
            </tr>
          ))}
      </tbody>
    </table>
  );
}

export default Table;
