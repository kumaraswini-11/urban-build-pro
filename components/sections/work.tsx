import Image from "next/image";
import { RiCheckboxCircleFill } from "react-icons/ri";

import { Pretitle } from "@/components/pretitle";
import { WorkData } from "@/lib/constants";
import { SECTION_IDS } from "@/lib/section-ids";

// Project details are always visible on touch/small screens and revealed on
// hover or keyboard focus on large screens (U8). The placeholder "#" project
// links were removed until real case studies exist (U4).
export const Work = () => {
  return (
    <section className="py-16 xl:py-32" id={SECTION_IDS.work}>
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-[540px] text-center xl:mb-20">
          <Pretitle text="Our Portfolio" center />
          <h2 className="h2 mb-4 text-foreground">
            Crafting Iconic Structures
          </h2>
          <p className="text-muted-foreground">
            From industrial hubs to luxury residences, explore the precision and
            scale of our recent construction projects.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
          {WorkData.map((project) => (
            <li
              key={project.name}
              // biome-ignore lint/a11y/noNoninteractiveTabindex: lets keyboard users reveal the project details
              tabIndex={0}
              className="group relative h-[500px] overflow-hidden bg-primary focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
            >
              <Image
                src={project.img}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                alt=""
                className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-40"
              />

              <div className="absolute inset-x-4 bottom-4 bg-background p-6 text-foreground transition-transform duration-500 lg:translate-y-[110%] lg:group-focus:translate-y-0 lg:group-hover:translate-y-0 lg:group-focus-within:translate-y-0">
                <h3 className="font-barlow font-bold text-xl uppercase tracking-wider">
                  {project.name}
                </h3>
                <p className="mt-2 flex items-center gap-2 text-foreground/80 text-sm">
                  <RiCheckboxCircleFill
                    aria-hidden="true"
                    className="shrink-0"
                  />
                  {project.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
