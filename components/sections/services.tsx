"use client";

import Image from "next/image";
import { useState } from "react";

import { ConstructionButton } from "@/components/construction-button";
import { Pretitle } from "@/components/pretitle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { services } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const Services = () => {
  const [activeTab, setActiveTab] = useState(services[0]?.name);

  return (
    <section id="services" className="bg-muted/50 py-16 xl:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-[540px] text-center">
          <Pretitle text="Our Expertise" center />
          <h2 className="h2 mb-4 text-foreground">Construction Solutions</h2>
          <p className="text-foreground">
            Delivering <strong>precision-engineered</strong> results across
            every phase of the build cycle.
          </p>
        </div>

        <Tabs
          defaultValue={services[0]?.name}
          onValueChange={setActiveTab}
          className="flex flex-col gap-10 xl:flex-row xl:data-[orientation=horizontal]:flex-row"
        >
          <TabsList className="grid h-full w-full grid-cols-1 gap-4 bg-transparent p-0 group-data-[orientation=horizontal]/tabs:h-auto md:grid-cols-2 xl:w-[350px] xl:grid-cols-1">
            {services.map((service) => (
              <TabsTrigger
                key={service.name}
                value={service.name}
                className={cn(
                  "relative flex h-24 items-center justify-start px-0 transition-all",
                  activeTab === service.name
                    ? "border-primary bg-background shadow-lg"
                    : "border-border/40 bg-background/50",
                )}
              >
                <div
                  className={cn(
                    "flex size-24 items-center justify-center transition-colors",
                    activeTab === service.name
                      ? "bg-primary text-inverse"
                      : "bg-primary/20 text-primary",
                  )}
                >
                  <service.icon className="size-8" />
                </div>
                <span className="ml-6 font-bold text-xs uppercase tracking-widest">
                  {service.name}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex-1 rounded-sm bg-background p-8 shadow-xl md:p-12">
            {services.map((service) => (
              <TabsContent
                key={service.name}
                value={service.name}
                className="m-0 focus-visible:outline-none"
              >
                <div className="flex flex-col gap-10 lg:flex-row">
                  <div className="flex flex-row gap-4 lg:flex-col">
                    {service.images.slice(0, 2).map((image) => (
                      <div
                        key={image.url}
                        className={cn(
                          "relative aspect-square h-[140px] w-[140px] overflow-hidden rounded-sm xl:h-[200px] xl:w-[200px]",
                          "grayscale transition-all duration-500 hover:grayscale-0",
                        )}
                      >
                        <Image
                          src={image.url}
                          fill
                          sizes="(min-width: 1280px) 200px, 140px"
                          alt={service.name}
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex-1">
                    <h3 className="h3 mb-6">{service.title}</h3>
                    <p className="mb-8 text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="mb-10 grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2">
                      {service.serviceList.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-3 font-semibold text-foreground/70 text-sm"
                        >
                          <div className="size-1.5 rotate-45 bg-primary" />{" "}
                          {item}
                        </li>
                      ))}
                    </ul>
                    <ConstructionButton
                      href="#contact"
                      label="Request a quote"
                    />
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
