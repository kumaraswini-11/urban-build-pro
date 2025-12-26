"use client";

import { Link as ScrollLink } from "react-scroll";

import { NavLink } from "@/lib/types";
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
          "hover:text-primary text-background relative cursor-pointer text-[13px] font-bold tracking-[2px] uppercase transition-colors",
          "after:bg-foreground after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:transition-transform after:duration-300",
        )}
        onClick={onClick}
      >
        {link.label}
      </ScrollLink>
      {!isLast && (
        <span
          className="text-background/20 mx-2 hidden xl:block"
          aria-hidden="true"
        >
          /
        </span>
      )}
    </li>
  );
};
