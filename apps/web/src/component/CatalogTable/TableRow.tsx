import Link from "next/link";
import type { CatalogData } from "../../types/DbTypes";
import Badge from "./Badge";

interface TableRowProps {
  data: CatalogData;
  onClick?: () => void;
}

function TableRow({ data, onClick }: TableRowProps) {
  const tdStyle = "px-6 py-6 font-medium leading-tight text-sm text-white";
  return (
    <tr
      className="cursor-pointer border-2 border-zinc-700 hover:bg-active"
      onClick={onClick}
    >
      <td className={tdStyle + " flex flex-col"}>
        <Link
          href={`/dish/${data.id}`}
          className="hover:underline focus-visible:underline focus-visible:outline-none"
          // The row also navigates on click; avoid a second navigation.
          onClick={(event) => event.stopPropagation()}
        >
          {data.name}
        </Link>
        <p className="truncate pt-1 text-sm text-gray-300">
          {data.description}
        </p>
      </td>
      <td className={tdStyle}>
        <div className="flex flex-wrap gap-x-2 gap-y-2">
          {data?.categories.map((e) => (
            <Badge key={e} text={e} />
          ))}
        </div>
      </td>
      <td className={tdStyle}>
        <div className="flex flex-wrap gap-x-2 gap-y-2">
          {data?.tastes.slice(0, 2).map((e) => (
            <Badge key={e} text={e} />
          ))}
          {data?.tastes.length > 2 && (
            <Badge key="extra" text={`+${data.tastes.length - 2}`} />
          )}
        </div>
      </td>
      <td className={tdStyle + " text-center"}>{data.cookingTime} min</td>
      <td className={tdStyle + " text-center"}>
        {[1, 2, 3].map((i) =>
          i <= data?.cookingDifficulty ? (
            <span key={i} className="text-yellow-400">
              ★
            </span>
          ) : (
            <span key={i} className="text-zinc-500">
              ☆
            </span>
          ),
        )}
      </td>
    </tr>
  );
}

export default TableRow;
