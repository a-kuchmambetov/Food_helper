import type { CatalogData } from "../../types/DbTypes";
import TableRow from "./TableRow";

interface TableProps {
  data: Array<CatalogData>;
}

function Table({ data }: TableProps) {
  console.log("Table data:", data);
  return (
    <table className="w-full text-left">
      <thead>
        <tr className="border-t-0 border-2 border-zinc-700">
          <th className="px-6 py-3 text-sm text-zinc-400">Dish name</th>
          <th className="px-6 py-3 text-sm text-zinc-400">Category</th>
          <th className="px-6 py-3 text-sm text-zinc-400">Taste</th>
          <th className="px-6 py-3 text-sm text-zinc-400">Cooking time</th>
          <th className="px-6 py-3 text-sm text-zinc-400">
            Cooking difficulty
          </th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 && data.map((e) => <TableRow key={e.id} data={e} />)}
      </tbody>
    </table>
  );
}

export default Table;
