"use client";

import Link from "next/link";
import { IconType } from "react-icons";
import { RiPhoneFill, RiMailFill } from "react-icons/ri";

import { Socials } from "@/components/socials";
import { CONTACT_INFO } from "@/lib/constants";

const ContactLink = ({
  icon: Icon,
  text,
  href,
}: {
  icon: IconType;
  text: string;
  href: string;
}) => (
  <div className="group flex items-center gap-3">
    <div className="bg-primary flex size-8 items-center justify-center rounded-sm text-white transition-transform group-hover:scale-110">
      <Icon className="size-4" />
    </div>
    <Link
      href={href}
      className="text-primary text-sm font-bold tracking-tight hover:underline"
    >
      {text}
    </Link>
  </div>
);

export const Topbar = () => {
  return (
    <section
      className="from-accent to-accent/80 flex w-full items-center bg-linear-to-t py-3 xl:h-12 xl:py-0"
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
            containerStyles="gap-3 mx-auto xl:m-0"
            iconStyles="text-primary border-primary/20 hover:border-primary hover:bg-primary hover:text-white size-8"
          />
        </div>
      </div>
    </section>
  );
};
