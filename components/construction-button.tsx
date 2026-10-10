import type { ComponentProps } from "react";
import { RiArrowRightUpLine } from "react-icons/ri";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConstructionButtonProps extends ComponentProps<typeof Button> {
  label: string;
}

export const ConstructionButton = ({
  label,
  className,
  variant = "default",
  ...props
}: ConstructionButtonProps) => {
  return (
    <Button
      variant={variant}
      className={cn(
        "group flex h-13.5 w-52.5 items-center justify-between overflow-hidden py-1.25 pr-1.25 pl-2.5 transition-all",
        "border text-foreground",
        className,
      )}
      {...props}
    >
      <span className="flex-1 font-bold text-sm uppercase tracking-[1.2px]">
        {label}
      </span>
      <span className="ml-2 flex size-10 items-center justify-center rounded-sm bg-foreground transition-colors group-hover:bg-foreground/90">
        <RiArrowRightUpLine className="text-background text-xl transition-transform group-hover:rotate-45" />
      </span>
    </Button>
  );
};
