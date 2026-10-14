"use client";

interface BadgeProps {
  text?: string;
}

function Badge({ text = "" }: BadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full border-2 border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-xs font-medium text-nowrap text-gray-200">
      {text}
    </span>
  );
}

export default Badge;
