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
          aria-label={social.ariaLabel}
          className={cn(
            "group hover:border-accent hover:bg-accent relative flex size-10 items-center justify-center rounded-sm border border-white/10 transition-all duration-300",
            iconStyles,
          )}
        >
          <social.icon className="group-hover:text-primary size-5 transition-colors" />
          {/* Tooltip for desktop accessibility */}
          <span className="sr-only">{social.name}</span>
        </Link>
      ))}
    </nav>
  );
};
