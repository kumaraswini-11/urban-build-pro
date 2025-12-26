import { ComponentProps } from "react";
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
        "text-foreground border",
        className,
      )}
      {...props}
    >
      <span className="flex-1 text-sm font-bold tracking-[1.2px] uppercase">
        {label}
      </span>
      <span className="bg-foreground group-hover:bg-foreground/90 ml-2 flex size-10 items-center justify-center rounded-sm transition-colors">
        <RiArrowRightUpLine className="text-background text-xl transition-transform group-hover:rotate-45" />
      </span>
    </Button>
  );
};
