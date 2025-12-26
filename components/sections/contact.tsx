import { IconType } from "react-icons";
import { RiChat1Line, RiMapPin2Line, RiSmartphoneLine } from "react-icons/ri";

import { Socials } from "@/components/socials";
// import { ContactForm } from "@/components/contact-form";

export const Contact = () => {
  return (
    <section id="contact" className="py-16 xl:py-32">
      <div className="container mx-auto px-4">
        <div className="border-accent grid grid-cols-1 border-t-4 bg-white shadow-2xl xl:grid-cols-[400px_1fr]">
          {/* Info Sidebar */}
          <div className="border-slate-200 bg-slate-50 p-10 xl:border-r">
            <h4 className="h4 mb-8">Contact Us</h4>
            <div className="space-y-10">
              <ContactInfoItem
                icon={RiChat1Line}
                title="Chat to us"
                desc="Support team available 24/7"
                detail="hi@skyline.build"
              />
              <ContactInfoItem
                icon={RiMapPin2Line}
                title="Visit Us"
                desc="Main HQ & Showroom"
                detail="123 Builder St, NY"
              />
              <ContactInfoItem
                icon={RiSmartphoneLine}
                title="Call Us"
                desc="Mon-Fri, 9am - 6pm"
                detail="+1 (555) 000-111"
              />
            </div>
            <div className="mt-12 border-t border-slate-200 pt-8">
              <p className="mb-4 text-xs font-bold tracking-widest uppercase opacity-50">
                Follow our progress
              </p>
              <Socials
                containerStyles="gap-4"
                iconStyles="size-10 border-slate-200"
              />
            </div>
          </div>

          {/* Form Area */}
          <div className="p-10 xl:p-16">
            <h2 className="h2 mb-4">Request A Quote</h2>
            <p className="text-muted-foreground mb-10">
              Fill out the form below and our engineering team will contact you
              within 24 hours.
            </p>
            {/* <ContactForm /> */}
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
    <div className="bg-accent text-primary flex size-10 shrink-0 items-center justify-center rounded-sm">
      <Icon className="text-xl" />
    </div>
    <div>
      <h5 className="text-lg leading-tight font-bold">{title}</h5>
      <p className="text-muted-foreground mb-1 text-sm">{desc}</p>
      <p className="text-primary font-bold">{detail}</p>
    </div>
  </div>
);
