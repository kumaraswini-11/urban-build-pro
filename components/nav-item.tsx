import type { MouseEvent } from "react";

import type { NavLink } from "@/lib/types";
import { cn } from "@/lib/utils";

interface NavItemProps {
  link: NavLink;
  isLast: boolean;
  isActive: boolean;
  /** Used by the mobile menu to close the sheet before scrolling. */
  onNavigate?: (event: MouseEvent<HTMLAnchorElement>, id: string) => void;
}

export const NavItem = ({
  link,
  isLast,
  isActive,
  onNavigate,
}: NavItemProps) => {
  return (
    <li className="flex items-center">
      {/* Native anchors: keyboard-reachable and work without JavaScript (U1). */}
      <a
        href={`#${link.path}`}
        aria-current={isActive ? "true" : undefined}
        onClick={
          onNavigate ? (event) => onNavigate(event, link.path) : undefined
        }
        className={cn(
          "relative font-bold text-[13px] text-on-inverse uppercase tracking-[2px] transition-colors hover:text-primary",
          "after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300",
          isActive && "text-primary after:scale-x-100",
        )}
      >
        {link.label}
      </a>
      {!isLast && (
        <span
          className="mx-2 hidden text-on-inverse/20 xl:block"
          aria-hidden="true"
        >
          /
        </span>
      )}
    </li>
  );
};
