import Link from "next/link";

import { SOCIAL_LINKS } from "@/lib/constants";
import type { SocialsProps } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Socials = ({ containerStyles, iconStyles }: SocialsProps) => {
  return (
    <ul className={cn("flex items-center gap-4", containerStyles)}>
      {SOCIAL_LINKS.map((social) => (
        <li key={social.name}>
          <Link
            href={social.path}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.ariaLabel || social.name}
            className={cn(
              "group relative flex size-10 items-center justify-center rounded-md border border-border bg-transparent transition-all duration-300",
              "hover:border-accent hover:bg-accent hover:text-accent-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              iconStyles,
            )}
          >
            <social.icon
              className={cn("size-5 text-inherit transition-colors")}
            />
            <span className="sr-only">{social.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};
