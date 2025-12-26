import Link from "next/link";

import { SOCIAL_LINKS } from "@/lib/constants";
import { SocialsProps } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Socials = ({ containerStyles, iconStyles }: SocialsProps) => {
  return (
    <nav className={cn("flex items-center gap-4", containerStyles)}>
      {SOCIAL_LINKS.map((social) => (
        <Link
          key={social.name}
          href={social.path}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.ariaLabel || social.name}
          className={cn(
            "group border-border relative flex size-10 items-center justify-center rounded-md border bg-transparent transition-all duration-300",
            "hover:border-accent hover:bg-accent hover:text-accent-foreground",
            "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
            iconStyles,
          )}
        >
          <social.icon
            className={cn(
              "size-5 text-inherit transition-colors",
              "group-hover:text-accent",
            )}
          />
          <span className="sr-only">{social.name}</span>
        </Link>
      ))}
    </nav>
  );
};
