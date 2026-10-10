"use client";

import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { testimonials } from "@/lib/constants";

// shadcn Carousel (Embla) replaces Swiper: no autoplay, so nothing moves
// without the user (WCAG 2.2.2), and large prev/next targets (2.5.8).
export const Slider = () => {
  return (
    <Carousel
      opts={{ loop: true }}
      aria-label="Client testimonials"
      className="relative w-full"
    >
      <CarouselContent>
        {testimonials.map(({ id, text, name, image }) => (
          <CarouselItem key={id}>
            <figure className="flex flex-col gap-4 pt-2 pb-16">
              <div className="relative flex size-[70px] shrink-0">
                <Image
                  src={image}
                  fill
                  sizes="90px"
                  className="rounded-none object-cover grayscale"
                  alt=""
                />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <blockquote className="text-muted-foreground italic leading-relaxed md:text-base">
                  {text}
                </blockquote>
                <figcaption className="mt-2 flex items-center gap-3">
                  <span aria-hidden="true" className="h-px w-6 bg-primary" />
                  <span className="font-barlow font-bold text-foreground text-sm uppercase tracking-wider">
                    {name}
                  </span>
                </figcaption>
              </div>
            </figure>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="absolute right-0 bottom-0 flex gap-2">
        <CarouselPrevious className="static size-10 translate-y-0 rounded-none border-0 bg-primary text-inverse hover:bg-primary/90" />
        <CarouselNext className="static size-10 translate-y-0 rounded-none border-0 bg-primary text-inverse hover:bg-primary/90" />
      </div>
    </Carousel>
  );
};
