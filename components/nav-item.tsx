"use client";

import { Link as ScrollLink } from "react-scroll";

import { NavLink } from "@/lib/types";
import { cn } from "@/lib/utils";

interface NavItemProps {
  link: NavLink;
  isLast: boolean;
  onClick?: () => void;
}

export const NavItem = ({ link, isLast, onClick }: NavItemProps) => {
  return (
    <li className="flex items-center">
      <ScrollLink
        to={link.path}
        smooth
        spy
        offset={-70}
        activeClass="text-accent after:scale-x-100"
        className={cn(
          "hover:text-accent relative cursor-pointer text-[13px] font-bold tracking-[2px] text-white uppercase transition-colors",
          "after:bg-accent after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:transition-transform after:duration-300",
        )}
        onClick={onClick}
      >
        {link.label}
      </ScrollLink>
      {!isLast && (
        <span className="mx-6 hidden text-white/20 xl:block" aria-hidden="true">
          /
        </span>
      )}
    </li>
  );
};
