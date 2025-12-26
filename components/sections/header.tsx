"use client";

import React from "react";

import { ConstructionButton } from "@/components/construction-button";
import { Logo } from "@/components/logo";
import { NavItem } from "@/components/nav-item";
import { NavMobile } from "@/components/nav-mobile";
import { navLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface HeaderProps {
  isSticky?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isSticky }) => {
  return (
    <header
      id="home"
      className={cn("bg-foreground w-full", isSticky ? "py-2" : "py-0")}
      aria-label="Main navigation"
    >
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="flex w-full items-center justify-between">
          <Logo />

          <nav
            className="hidden items-center gap-8 xl:flex"
            aria-label="Desktop navigation"
          >
            <ul className="flex items-center gap-6">
              {navLinks.map((link, index) => (
                <NavItem
                  key={link.id}
                  link={link}
                  isLast={index === navLinks.length - 1}
                />
              ))}
            </ul>

            <ConstructionButton label="Get a quote" variant="secondary" />
          </nav>

          <div className="xl:hidden">
            <NavMobile />
          </div>
        </div>
      </div>
    </header>
  );
};
