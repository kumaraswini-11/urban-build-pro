"use client";

import { Link as ScrollLink } from "react-scroll";

import type { NavLink } from "@/lib/types";
import { cn } from "@/lib/utils";

interface NavItemProps {
  link: NavLink;
  isLast: boolean;
  onClick?: () => void; // For closing mobile menu
}

export const NavItem = ({ link, isLast, onClick }: NavItemProps) => {
  return (
    <li className="flex items-center">
      <ScrollLink
        to={link.path}
        smooth
        spy
        offset={-70}
        activeClass="text-foreground after:scale-x-100"
        className={cn(
          "relative cursor-pointer font-bold text-[13px] text-background uppercase tracking-[2px] transition-colors hover:text-primary",
          "after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-foreground after:transition-transform after:duration-300",
        )}
        onClick={onClick}
      >
        {link.label}
      </ScrollLink>
      {!isLast && (
        <span
          className="mx-2 hidden text-background/20 xl:block"
          aria-hidden="true"
        >
          /
        </span>
      )}
    </li>
  );
};
