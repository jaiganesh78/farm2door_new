import { cn } from "@/lib/utils";

export const Input = ({ label, error, className, id, ...props }) => {
  return (
    <div className="space-y-1 w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm transition-colors",
          error && "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};
