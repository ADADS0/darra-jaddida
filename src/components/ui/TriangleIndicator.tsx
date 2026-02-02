import { cn } from "@/lib/utils";

interface TriangleIndicatorProps {
  direction: "up" | "down" | "neutral";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const TriangleIndicator = ({ direction, size = "md", className }: TriangleIndicatorProps) => {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  if (direction === "neutral") {
    return (
      <div className={cn("rounded-full bg-[#787b86]", sizeClasses[size], className)} />
    );
  }

  const isUp = direction === "up";
  
  return (
    <svg 
      viewBox="0 0 10 10" 
      className={cn(sizeClasses[size], className)}
      fill={isUp ? "#089981" : "#f23645"}
    >
      {isUp ? (
        <polygon points="5,0 10,10 0,10" />
      ) : (
        <polygon points="0,0 10,0 5,10" />
      )}
    </svg>
  );
};

export default TriangleIndicator;
