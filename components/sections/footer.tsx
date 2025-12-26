"use client";

import Image from "next/image";
import Link from "next/link";
import {
  RiArrowRightLine,
  RiMailFill,
  RiMapPin2Fill,
  RiPhoneFill,
} from "react-icons/ri";

import { Socials } from "@/components/socials";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CONTACT_INFO } from "@/lib/constants";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary border-accent mt-16 border-t-8 xl:mt-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-12 py-16 xl:flex-row xl:gap-24 xl:py-24">
          {/* Brand Identity */}
          <div className="flex-1 space-y-6">
            <Link href="/" className="inline-block">
              <Image
                src="/assets/logo.svg"
                alt="UrbanBuild Logo"
                width={200}
                height={40}
                className="brightness-0 invert" // Ensures logo is white on dark bg
              />
            </Link>
            <p className="max-w-sm leading-relaxed text-slate-400">
              Leading the way in modern urban construction. We combine
              engineering precision with sustainable practices to build the
              future of our cities.
            </p>
          </div>

          {/* Contact Details */}
          <div className="flex-1">
            <h4 className="font-barlow mb-8 text-xl font-bold tracking-widest text-white uppercase">
              Contact Us
            </h4>
            <ul className="space-y-5 text-slate-300">
              <li className="flex items-start gap-4">
                <RiMapPin2Fill className="text-accent mt-1 shrink-0 text-xl" />
                <address className="not-italic">{CONTACT_INFO.address}</address>
              </li>
              <li className="group flex items-center gap-4">
                <RiPhoneFill className="text-accent shrink-0 text-xl" />
                <Link
                  href={`tel:${CONTACT_INFO.phone}`}
                  className="hover:text-accent transition-colors"
                >
                  {CONTACT_INFO.phone}
                </Link>
              </li>
              <li className="group flex items-center gap-4">
                <RiMailFill className="text-accent shrink-0 text-xl" />
                <Link
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="hover:text-accent lowercase transition-colors"
                >
                  {CONTACT_INFO.email}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="flex-1">
            <h4 className="font-barlow mb-8 text-xl font-bold tracking-widest text-white uppercase">
              Newsletter
            </h4>
            <p className="mb-6 text-slate-400">
              Stay updated with our latest project milestones and industry
              insights.
            </p>
            <form className="group relative">
              <Input
                type="email"
                placeholder="Your email address"
                className="focus-visible:ring-accent h-14 w-full rounded-none border-none bg-slate-800 pr-16 pl-6 text-white placeholder:text-slate-500 focus-visible:ring-1"
                required
              />
              <Button
                type="submit"
                size="icon"
                className="bg-accent text-primary absolute top-1 right-1 bottom-1 h-12 w-12 rounded-none transition-all hover:bg-white"
              >
                <RiArrowRightLine className="text-xl" />
              </Button>
            </form>
          </div>
        </div>

        {/* Legal & Socials */}
        <div className="flex flex-col items-center justify-between gap-6 border-t border-slate-800 py-10 xl:flex-row">
          <p className="text-sm text-slate-500">
            © {currentYear}{" "}
            <span className="font-medium text-slate-300">UrbanBuild</span>.
            Designed for Excellence. All rights reserved.
          </p>
          <Socials
            containerStyles="flex gap-4"
            iconStyles="size-10 border-slate-700 text-slate-400 hover:border-accent hover:text-accent hover:bg-transparent"
          />
        </div>
      </div>
    </footer>
  );
};
