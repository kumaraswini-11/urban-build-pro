"use client";

import { type MouseEvent, useRef, useState } from "react";
import { RiMenu3Fill } from "react-icons/ri";

import { ConstructionButton } from "@/components/construction-button";
import { Logo } from "@/components/logo";
import { NavItem } from "@/components/nav-item";
import { Socials } from "@/components/socials";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks } from "@/lib/constants";

export const NavMobile = ({ activeId }: { activeId: string | null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pendingTarget = useRef<string | null>(null);

  // The sheet locks page scrolling while open, so close it first and scroll
  // once it has finished closing (see onCloseAutoFocus).
  const navigate = (event: MouseEvent<HTMLElement>, id: string) => {
    event.preventDefault();
    pendingTarget.current = id;
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="flex size-11 items-center justify-center text-3xl text-inverse transition-transform hover:opacity-75"
          aria-label="Open menu"
        >
          <RiMenu3Fill />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex w-[min(380px,90vw)] flex-col border-none bg-inverse p-0 text-on-inverse shadow-2xl"
        onCloseAutoFocus={(event) => {
          const id = pendingTarget.current;
          if (!id) return;
          event.preventDefault();
          pendingTarget.current = null;
          const target = document.getElementById(id);
          target?.scrollIntoView();
          target?.setAttribute("tabindex", "-1");
          target?.focus({ preventScroll: true });
          history.pushState(null, "", `#${id}`);
        }}
      >
        <div className="flex flex-col px-8 pt-10 pb-6">
          <Logo />
          <SheetHeader className="sr-only">
            <SheetTitle>Site menu</SheetTitle>
            <SheetDescription>Jump to a section of the page.</SheetDescription>
          </SheetHeader>
        </div>

        <nav
          className="flex flex-1 flex-col justify-center px-8"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-y-6">
            {navLinks.map((link, index) => (
              <NavItem
                key={link.id}
                link={link}
                isLast={index === navLinks.length - 1}
                isActive={activeId === link.path}
                onNavigate={navigate}
              />
            ))}
          </ul>

          <div className="mt-12">
            <ConstructionButton
              href="#contact"
              label="Get a quote"
              onClick={(event) => navigate(event, "contact")}
            />
          </div>
        </nav>

        <div className="mt-auto border-on-inverse/10 border-t px-8 py-10">
          <p className="mb-4 font-bold text-[10px] text-on-inverse uppercase tracking-[2px]">
            Connect with us
          </p>
          <Socials
            containerStyles="flex gap-5"
            iconStyles="transition-colors border-primary text-on-inverse text-2xl hover:bg-primary/70 hover:text-inverse"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
