"use client";

import { useState } from "react";
import { RiMenu3Fill } from "react-icons/ri";

import { ConstructionButton } from "@/components/construction-button";
import { Logo } from "@/components/logo";
import { NavItem } from "@/components/nav-item";
import { Socials } from "@/components/socials";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { navLinks } from "@/lib/constants";

export const NavMobile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="text-foreground flex cursor-pointer items-center justify-center text-3xl transition-transform hover:opacity-75"
          aria-label="Open Menu"
        >
          <RiMenu3Fill />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="bg-foreground text-background flex w-[min(380px,90vw)] flex-col border-none p-0 shadow-2xl"
      >
        {/* Header Area */}
        <div className="flex flex-col px-8 pt-10 pb-6">
          <SheetHeader className="pl-0 text-left">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-left">
                <Logo />
              </SheetTitle>
            </div>
            <SheetDescription className="sr-only">
              Navigation menu for mobile devices.
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-1 flex-col justify-center px-8">
          <ul className="flex flex-col gap-y-6">
            {navLinks.map((link, index) => (
              <NavItem
                key={link.id}
                link={link}
                isLast={index === navLinks.length - 1}
                onClick={handleClose}
              />
            ))}
          </ul>

          <div className="mt-12">
            <ConstructionButton label="Get a Quote" onClick={handleClose} />
          </div>
        </nav>

        {/* Footer Area with Socials */}
        <div className="border-border/10 bg-muted-foreground/5 mt-auto border-t px-8 py-10">
          <p className="text-background mb-4 text-[10px] font-bold tracking-[2px] uppercase">
            Connect with us
          </p>
          <Socials
            containerStyles="flex gap-5"
            iconStyles="transition-colors border-primary text-background text-2xl hover:bg-primary/70 hover:text-foreground"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
