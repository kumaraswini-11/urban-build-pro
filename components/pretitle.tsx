import { cn } from "@/lib/utils";

interface PretitleProps {
  text: string;
  center?: boolean;
  className?: string;
}

export const Pretitle = ({ text, center, className }: PretitleProps) => {
  return (
    <div
      className={cn(
        "mb-4 flex items-center gap-4",
        center ? "justify-center" : "justify-start",
        className,
      )}
    >
      {/* Left Marker */}
      <div className="size-2 shrink-0 rotate-45 bg-primary" />

      <span className="font-semibold text-foreground/80 text-xs uppercase tracking-[3px] md:text-sm">
        {text}
      </span>

      {/* Right Marker - only shown if centered or specifically needed */}
      {center && <div className="size-2 shrink-0 rotate-45 bg-primary" />}
    </div>
  );
};
