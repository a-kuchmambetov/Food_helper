interface BadgeProps {
  text?: string;
}

function Badge({ text = "" }: BadgeProps) {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium text-gray-200 bg-zinc-800 border-2 border-zinc-700 text-nowrap">
      {text}
    </span>
  );
}

export default Badge;
