"use client";

import { useState } from "react";
import { RiMenu3Fill, RiCloseLine } from "react-icons/ri";

import { ConstructionButton } from "@/components/construction-button";
import { Logo } from "@/components/logo";
import { NavItem } from "@/components/nav-item";
import { Socials } from "@/components/socials";
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
        <button
          className="flex cursor-pointer items-center justify-center text-3xl text-white transition-transform hover:scale-110 active:scale-95"
          aria-label="Open Menu"
        >
          <RiMenu3Fill />
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="bg-primary flex w-[min(380px,90vw)] flex-col border-none p-0 text-white shadow-2xl"
      >
        {/* Header Area */}
        <div className="flex flex-col px-8 pt-10 pb-6">
          <SheetHeader className="text-left">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-left">
                <Logo />
              </SheetTitle>
              {/* Note: The Radix/shadcn Sheet usually provides a close button, 
                  but we can style the header for a premium feel */}
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
            <ConstructionButton
              label="Get a Quote"
              className="bg-accent w-full"
              onClick={handleClose}
            />
          </div>
        </nav>

        {/* Footer Area with Socials */}
        <div className="mt-auto border-t border-white/10 bg-black/20 px-8 py-10">
          <p className="mb-4 text-[10px] font-bold tracking-[2px] text-white/40 uppercase">
            Connect with us
          </p>
          <Socials
            containerStyles="flex gap-5"
            iconStyles="text-white hover:text-accent transition-colors text-2xl"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
