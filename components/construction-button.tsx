import type { ComponentProps } from "react";
import { RiArrowRightUpLine } from "react-icons/ri";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConstructionButtonProps extends ComponentProps<typeof Button> {
  label: string;
  /** Renders a link instead of a button (e.g. "#contact"). */
  href?: string;
}

export const ConstructionButton = ({
  label,
  href,
  className,
  variant = "default",
  ...props
}: ConstructionButtonProps) => {
  const content = (
    <>
      <span className="flex-1 font-bold text-sm uppercase tracking-[1.2px]">
        {label}
      </span>
      <span
        aria-hidden="true"
        className="ml-2 flex size-10 items-center justify-center rounded-sm bg-inverse transition-colors group-hover:bg-inverse/90"
      >
        <RiArrowRightUpLine className="text-on-inverse text-xl transition-transform group-hover:rotate-45" />
      </span>
    </>
  );
  const classes = cn(
    "group flex h-13.5 w-52.5 items-center justify-between overflow-hidden border py-1.25 pr-1.25 pl-2.5 transition-all",
    // Text on the yellow button stays dark in both themes.
    variant === "default" ? "text-inverse" : "text-secondary-foreground",
    className,
  );

  if (href) {
    return (
      <Button asChild variant={variant} className={classes} {...props}>
        <a href={href}>{content}</a>
      </Button>
    );
  }
  return (
    <Button variant={variant} className={classes} {...props}>
      {content}
    </Button>
  );
};
