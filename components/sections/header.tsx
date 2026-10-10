"use client";

import { ConstructionButton } from "@/components/construction-button";
import { Logo } from "@/components/logo";
import { NavItem } from "@/components/nav-item";
import { NavMobile } from "@/components/nav-mobile";
import { ThemeToggle } from "@/components/theme-toggle";
import { useActiveSection } from "@/hooks/use-active-section";
import { navLinks } from "@/lib/constants";
import { SECTION_IDS } from "@/lib/section-ids";

const ALL_SECTION_IDS = Object.values(SECTION_IDS);

// One CSS-sticky header (replaces the static header + fixed duplicate, U9).
// Being in normal flow, it is also compensated by Radix scroll-lock padding.
export const Header = () => {
  const activeId = useActiveSection(ALL_SECTION_IDS);

  return (
    <header className="sticky top-0 z-50 w-full bg-inverse shadow-lg">
      <div className="container mx-auto flex h-20 items-center px-4">
        <div className="flex w-full items-center justify-between">
          <Logo />

          <nav
            className="hidden items-center gap-6 xl:flex"
            aria-label="Main navigation"
          >
            <ul className="flex items-center gap-6">
              {navLinks.map((link, index) => (
                <NavItem
                  key={link.id}
                  link={link}
                  isLast={index === navLinks.length - 1}
                  isActive={activeId === link.path}
                />
              ))}
            </ul>
            <ThemeToggle />
            <ConstructionButton
              href="#contact"
              label="Get a quote"
              variant="secondary"
            />
          </nav>

          <div className="flex items-center gap-2 xl:hidden">
            <ThemeToggle />
            <NavMobile activeId={activeId} />
          </div>
        </div>
      </div>
    </header>
  );
};
