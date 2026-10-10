"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { RiArrowRightUpLine, RiCheckboxCircleFill } from "react-icons/ri";

import { Pretitle } from "@/components/pretitle";
import { buttonVariants } from "@/components/ui/button";
import { WorkData } from "@/lib/constants";

export const Work = () => {
  return (
    <section className="py-16 xl:py-32" id="work">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-135 text-center xl:mb-20">
          <Pretitle text="Our Portfolio" center />
          <h2 className="h2 mb-4 text-foreground">
            Crafting Iconic Structures
          </h2>
          <p className="text-muted-foreground">
            From industrial hubs to luxury residences, explore the precision and
            scale of our recent construction projects.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
          {WorkData.map((project, index) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative h-[500px] overflow-hidden bg-primary"
            >
              <Image
                src={project.img}
                fill
                alt={project.name}
                className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-40"
              />

              {/* Hover Overlay Content */}
              <div className="absolute inset-x-4 bottom-4 translate-y-[110%] bg-background p-6 text-foreground transition-transform duration-500 group-hover:translate-y-0">
                <div className="flex items-center justify-between gap-1">
                  <div>
                    <h3 className="font-barlow font-bold text-xl uppercase tracking-wider">
                      {project.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-2 text-foreground text-sm">
                      <RiCheckboxCircleFill />
                      <span className="text-foreground/80">
                        {project.description}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={project.href}
                    className={buttonVariants({ variant: "default" })}
                    // className="bg-foreground text-background flex size-12 items-center justify-center transition-colors hover:bg-white"
                    aria-label={`View ${project.name}`}
                  >
                    <RiArrowRightUpLine className="text-2xl" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
