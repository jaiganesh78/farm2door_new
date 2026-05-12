import { cn } from "@/lib/utils";

export const Button = ({
  className,
  variant = "primary",
  isLoading = false,
  disabled = false,
  children,
  ...props
}) => {
  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200 hover:shadow-green-300",
    secondary: "bg-white text-gray-900 border border-gray-100 hover:bg-gray-50 shadow-sm",
    outline: "border-2 border-gray-200 bg-transparent hover:border-green-600 hover:text-green-600",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-200",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-900",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/10 disabled:opacity-50 disabled:pointer-events-none active:scale-95 hover:-translate-y-0.5 uppercase tracking-widest text-[10px]",
        variants[variant],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="mr-2 h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};
