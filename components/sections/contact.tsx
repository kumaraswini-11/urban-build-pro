import type { IconType } from "react-icons";
import { RiChat1Line, RiMapPin2Line, RiSmartphoneLine } from "react-icons/ri";

import { Socials } from "@/components/socials";
import { QuoteForm } from "@/features/lead-capture/quote-form";
import { CONTACT_INFO } from "@/lib/constants";

export const Contact = () => {
  return (
    <section id="contact" className="py-16 xl:py-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 border-primary border-t-4 bg-background shadow-2xl xl:grid-cols-[400px_1fr]">
          {/* Info Sidebar */}
          <div className="border-border/30 bg-accent/10 p-10 xl:border-r">
            <h2 className="h4 mb-8 text-foreground">Contact Us</h2>
            <div className="space-y-10">
              <ContactInfoItem
                icon={RiChat1Line}
                title="Email us"
                desc="We reply within one business day"
                detail={CONTACT_INFO.email}
                href={`mailto:${CONTACT_INFO.email}`}
              />
              <ContactInfoItem
                icon={RiMapPin2Line}
                title="Visit Us"
                desc="Main HQ & Showroom"
                detail={CONTACT_INFO.address}
                href={CONTACT_INFO.mapHref}
              />
              <ContactInfoItem
                icon={RiSmartphoneLine}
                title="Call Us"
                desc="Mon-Fri, 9am - 6pm"
                detail={CONTACT_INFO.phone}
                href={CONTACT_INFO.phoneHref}
              />
            </div>
            <div className="mt-12 border-border/30 border-t pt-8">
              <p className="mb-4 font-bold text-muted-foreground text-xs uppercase tracking-widest">
                Follow our progress
              </p>
              <Socials
                containerStyles="gap-4"
                iconStyles="size-10 text-foreground border-primary/30 hover:bg-primary/75 hover:text-inverse"
              />
            </div>
          </div>

          {/* Form Area */}
          <div className="p-10 xl:p-16">
            <h2 className="h2 mb-4 text-foreground">Request A Quote</h2>
            <p className="mb-10 text-muted-foreground">
              Fill out the form below and our engineering team will contact you
              within 24 hours.
            </p>
            <QuoteForm />
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactInfoItem = ({
  icon: Icon,
  title,
  desc,
  detail,
  href,
}: {
  icon: IconType;
  title: string;
  desc: string;
  detail: string;
  href: string;
}) => (
  <div className="flex gap-4">
    <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
      <Icon aria-hidden="true" className="text-xl" />
    </div>
    <div>
      <h3 className="font-bold text-foreground text-lg leading-tight">
        {title}
      </h3>
      <p className="mb-1 text-muted-foreground text-sm">{desc}</p>
      <a
        href={href}
        className="font-bold text-foreground underline-offset-4 hover:underline"
        {...(href.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {detail}
      </a>
    </div>
  </div>
);
