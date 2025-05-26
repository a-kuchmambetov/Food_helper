interface ButtonProps {
  label: string;
  onClick?: () => void;
}

function Button({ label = "", onClick }: ButtonProps) {
  return (
    <button
      className="px-4 py-2 border border-zinc-800 bg-zinc-900 text-nowrap text-white rounded-lg hover:bg-bg-active transition-colors duration-300"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default Button;
