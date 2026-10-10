"use client";

import Link from "next/link";
import {
  RiArrowRightLine,
  RiMailFill,
  RiMapPin2Fill,
  RiPhoneFill,
} from "react-icons/ri";

import { Logo } from "@/components/logo";
import { Socials } from "@/components/socials";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CONTACT_INFO } from "@/lib/constants";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-primary border-t-6 bg-foreground xl:mt-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-12 py-16 xl:flex-row xl:gap-24 xl:py-24">
          {/* Brand Identity */}
          <div className="flex-1 space-y-6">
            <Logo />
            <p className="max-w-sm text-muted-foreground leading-relaxed">
              Leading the way in modern urban construction. We combine
              engineering precision with sustainable practices to build the
              future of our cities.
            </p>
          </div>

          {/* Contact Details */}
          <div className="flex-1">
            <h4 className="mb-8 font-barlow font-bold text-background text-xl uppercase tracking-widest">
              Contact Us
            </h4>
            <ul className="space-y-5 text-muted-foreground">
              <li className="flex items-start gap-4">
                <RiMapPin2Fill className="mt-1 shrink-0 text-primary text-xl" />
                <address className="not-italic">{CONTACT_INFO.address}</address>
              </li>
              <li className="group flex items-center gap-4">
                <RiPhoneFill className="shrink-0 text-primary text-xl" />
                <Link
                  href={`tel:${CONTACT_INFO.phone}`}
                  className="transition-colors hover:text-primary"
                >
                  {CONTACT_INFO.phone}
                </Link>
              </li>
              <li className="group flex items-center gap-4">
                <RiMailFill className="shrink-0 text-primary text-xl" />
                <Link
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="lowercase transition-colors hover:text-primary"
                >
                  {CONTACT_INFO.email}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="flex-1">
            <h4 className="mb-8 font-barlow font-bold text-background text-xl uppercase tracking-widest">
              Newsletter
            </h4>
            <p className="mb-6 text-muted-foreground">
              Stay updated with our latest project milestones and industry
              insights.
            </p>
            <form className="group relative">
              <Input
                type="email"
                placeholder="Your email address"
                className="h-14 w-full rounded-none border-none bg-accent/5 pr-16 pl-6 text-background shadow-xl focus-visible:ring-1 focus-visible:ring-primary"
                required
              />
              <Button
                type="submit"
                variant="secondary"
                size="icon"
                className="absolute top-1 right-1 bottom-1 h-12 w-12 rounded-none bg-primary text-foreground transition-all hover:bg-primary/85"
              >
                <RiArrowRightLine className="text-xl" />
              </Button>
            </form>
          </div>
        </div>

        {/* Legal & Socials */}
        <div className="flex flex-col items-center justify-between gap-6 border-border/10 border-t py-10 xl:flex-row">
          <p className="text-accent/60 text-sm">
            © {currentYear}{" "}
            <span className="font-medium text-background">UrbanBuild</span>.
            Designed for Excellence. All rights reserved.
          </p>
          <Socials
            containerStyles="flex gap-4"
            iconStyles="size-10 border-primary/20 bg-foreground text-background hover:text-primary hover:bg-transparent hover:border-primary"
          />
        </div>
      </div>
    </footer>
  );
};
