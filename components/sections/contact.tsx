import type { IconType } from "react-icons";
import { RiChat1Line, RiMapPin2Line, RiSmartphoneLine } from "react-icons/ri";

import { ContactForm } from "@/components/contact-form";
import { Socials } from "@/components/socials";
import { CONTACT_INFO } from "@/lib/constants";

export const Contact = () => {
  return (
    <section id="contact" className="py-16 xl:py-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 border-primary border-t-4 bg-background shadow-2xl xl:grid-cols-[400px_1fr]">
          {/* Info Sidebar */}
          <div className="border-border/30 bg-accent/10 p-10 xl:border-r">
            <h4 className="h4 mb-8 text-foreground">Contact Us</h4>
            <div className="space-y-10">
              <ContactInfoItem
                icon={RiChat1Line}
                title="Chat to us"
                desc="Support team available 24/7"
                detail={CONTACT_INFO.email}
              />
              <ContactInfoItem
                icon={RiMapPin2Line}
                title="Visit Us"
                desc="Main HQ & Showroom"
                detail={CONTACT_INFO.address}
              />
              <ContactInfoItem
                icon={RiSmartphoneLine}
                title="Call Us"
                desc="Mon-Fri, 9am - 6pm"
                detail={CONTACT_INFO.phone}
              />
            </div>
            <div className="mt-12 border-border/30 border-t pt-8">
              <p className="mb-4 font-bold text-foreground text-xs uppercase tracking-widest opacity-50">
                Follow our progress
              </p>
              <Socials
                containerStyles="gap-4"
                iconStyles="size-10 text-foreground border-primary/30 hover:bg-primary/75 hover:text-background"
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
            <ContactForm />
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
}: {
  icon: IconType;
  title: string;
  desc: string;
  detail: string;
}) => (
  <div className="flex gap-4">
    <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
      <Icon className="text-xl" />
    </div>
    <div>
      <h5 className="font-bold text-foreground text-lg leading-tight">
        {title}
      </h5>
      <p className="mb-1 text-muted-foreground text-sm">{desc}</p>
      <p className="font-bold text-foreground">{detail}</p>
    </div>
  </div>
);
