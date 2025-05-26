interface TableRowProps {
  recipeName?: string;
  category?: string;
  taste?: string[];
  cookingTime?: number;
  cookiingDifficulty?: number;
}

function TableRow({
  recipeName = "Test",
  category = "Soup",
  taste = ["Sweet", "Sour"],
}: TableRowProps) {
  return (
    <tr>
      <td>{recipeName}</td>
      <td>{category}</td>
      <td>{...taste}</td>
      <td>Cooking Time</td>
      <td>Cooking Difficulty</td>
    </tr>
  );
}

export default TableRow;
