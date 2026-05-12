import { cn } from "@/lib/utils";

const PageTransition = ({ children, className }) => {
  return (
    <div className={cn(
      "animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both",
      className
    )}>
      {children}
    </div>
  );
};

export default PageTransition;
