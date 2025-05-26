import CatalogTable from "../component/CatalogTable";
interface CatalogProps {
  className?: string;
}

function Catalog({ className = "" }: CatalogProps) {
  return (
    <div
      className={
        "flex flex-col items-center justify-start h-full bg-gradient-to-br from-black to-slate-900 text-white p-4 " +
        className
      }
    >
      <CatalogTable />
    </div>
  );
}

export default Catalog;
