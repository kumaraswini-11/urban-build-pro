"use client";

import Image from "next/image";
import { useState } from "react";

import { ConstructionButton } from "@/components/construction-button";
import { Pretitle } from "@/components/pretitle";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { services } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const Services = () => {
  const [activeTab, setActiveTab] = useState(services[0]?.name);

  return (
    <section id="services" className="bg-slate-50/50 py-16 xl:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-[540px] text-center">
          <Pretitle text="Our Expertise" center />
          <h2 className="h2 mb-4">Construction Solutions</h2>
          <p className="text-muted-foreground">
            Delivering <strong>precision-engineered</strong> results across
            every phase of the build cycle.
          </p>
        </div>

        <Tabs
          defaultValue={services[0]?.name}
          onValueChange={setActiveTab}
          className="flex flex-col gap-10 xl:flex-row"
        >
          <TabsList className="grid h-full w-full grid-cols-1 gap-4 bg-transparent p-0 md:grid-cols-2 xl:w-[350px] xl:grid-cols-1">
            {services.map((service) => (
              <TabsTrigger
                key={service.name}
                value={service.name}
                className={cn(
                  "relative flex h-24 items-center justify-start border-l-4 px-0 transition-all",
                  activeTab === service.name
                    ? "border-accent bg-white shadow-lg"
                    : "border-transparent bg-white/50",
                )}
              >
                <div
                  className={cn(
                    "flex size-24 items-center justify-center transition-colors",
                    activeTab === service.name
                      ? "bg-primary text-white"
                      : "bg-accent/20 text-primary",
                  )}
                >
                  <service.icon className="text-3xl" />
                </div>
                <span className="ml-6 text-xs font-bold tracking-widest uppercase">
                  {service.name}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex-1 rounded-sm bg-white p-8 shadow-xl md:p-12">
            {services.map((service) => (
              <TabsContent
                key={service.name}
                value={service.name}
                className="m-0 focus-visible:outline-none"
              >
                <div className="flex flex-col gap-10 lg:flex-row">
                  <div className="flex flex-row gap-4 lg:flex-col">
                    {service.images.slice(0, 2).map((image, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square w-full max-w-[180px] overflow-hidden rounded-sm grayscale transition-all duration-500 hover:grayscale-0"
                      >
                        <Image
                          src={image.url}
                          fill
                          alt={service.name}
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex-1">
                    <h3 className="h3 mb-6">{service.title}</h3>
                    <p className="text-muted-foreground mb-8 leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="mb-10 grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2">
                      {service.serviceList.map((item, i) => (
                        <li
                          key={i}
                          className="text-primary/70 flex items-center gap-3 text-sm font-semibold"
                        >
                          <div className="bg-accent size-1.5 rotate-45" />{" "}
                          {item}
                        </li>
                      ))}
                    </ul>
                    <ConstructionButton label="Service Details" />
                  </div>
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
};
