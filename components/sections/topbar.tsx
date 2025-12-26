"use client";

import Link from "next/link";
import { IconType } from "react-icons";
import { RiPhoneFill, RiMailFill } from "react-icons/ri";

import { Socials } from "@/components/socials";
import { CONTACT_INFO } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ContactLink = ({
  icon: Icon,
  text,
  href,
}: {
  icon: IconType;
  text: string;
  href: string;
}) => (
  <Link
    href={href}
    className="group focus-visible:ring-ring flex items-center gap-3 rounded-md focus-visible:ring-2 focus-visible:outline-none"
  >
    <div className="bg-foreground hover:bg-foreground/90 text-background flex size-8 items-center justify-center rounded-md transition-colors">
      <Icon className="size-4" />
    </div>
    <span className="text-foreground text-sm font-medium tracking-tight hover:underline">
      {text}
    </span>
  </Link>
);

export const Topbar = () => {
  return (
    <section
      className={cn(
        "from-primary to-primary/80 flex w-full items-center bg-linear-to-t py-3 xl:h-12 xl:py-0",
      )}
      aria-label="Contact information and social media"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
          {/* Contact Details */}
          <div className="hidden items-center gap-8 xl:flex">
            <ContactLink
              icon={RiPhoneFill}
              text={CONTACT_INFO.phone}
              href={`tel:${CONTACT_INFO.phone}`}
            />
            <ContactLink
              icon={RiMailFill}
              text={CONTACT_INFO.email}
              href={`mailto:${CONTACT_INFO.email}`}
            />
          </div>

          {/* Socials - Using the shared component with specialized styles */}
          <Socials
            containerStyles="gap-3 mx-auto xl:mx-0"
            iconStyles="text-foreground border border-foreground/20 hover:border-foreground hover:bg-foreground hover:text-background size-8 rounded-md transition-all"
          />
        </div>
      </div>
    </section>
  );
};
