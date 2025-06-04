import type { CatalogData } from "../../types/DbTypes";
import { v4 as uuidv4 } from "uuid";
import Badge from "./Badge";

interface TableRowProps {
  data: CatalogData;
  onClick?: () => void;
}

function TableRow({ data, onClick }: TableRowProps) {
  const tdStyle = "px-6 py-6 font-medium leading-tight text-sm text-white";
  return (
    <tr
      className="border-2 border-zinc-700 hover:bg-bg-active"
      onClick={onClick}
    >
      <td className={tdStyle + " flex flex-col"}>
        {data.name}
        <p className="pt-1 text-sm text-gray-300 truncate">
          {data.description}
        </p>
      </td>
      <td className={tdStyle}>
        <div className="flex flex-wrap gap-x-2 gap-y-2">
          {""}
          {data?.categories.map((e) => (
            <Badge key={uuidv4()} text={e} />
          ))}
        </div>
      </td>
      <td className={tdStyle}>
        <div className="flex flex-wrap gap-x-2 gap-y-2">
          {""}
          {data?.tastes.slice(0, 2).map((e) => (
            <Badge key={uuidv4()} text={e} />
          ))}
          {data?.tastes.length > 2 && (
            <Badge key="extra" text={`+${data.tastes.length - 2}`} />
          )}
        </div>
      </td>
      <td className={tdStyle + " text-center"}>{data.cookingTime} min</td>
      <td className={tdStyle + " text-center"}>
        {""}
        {[1, 2, 3].map((i) =>
          i <= data?.cookingDifficulty ? (
            <span key={i} className="text-yellow-400">
              ★
            </span>
          ) : (
            <span key={i} className="text-zinc-500">
              ☆
            </span>
          )
        )}
      </td>
    </tr>
  );
}

export default TableRow;
