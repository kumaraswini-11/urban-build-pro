"use client";

import Image from "next/image";
import { RiArrowLeftLine, RiArrowRightLine } from "react-icons/ri";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import { Button } from "@/components/ui/button";
import { testimonials } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const Slider: React.FC = () => {
  return (
    <div className="relative w-full max-w-[630px]">
      <Swiper
        modules={[Pagination, Autoplay]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, el: ".swiper-custom-pagination" }}
        className={cn(
          "border-accent h-[280px] w-full border-b-4 bg-white shadow-2xl md:h-[220px]",
          "mySwiper",
        )}
        aria-live="polite"
      >
        {testimonials.map(({ id, text, name, image }) => (
          <SwiperSlide key={id} role="group" className="bg-white">
            <div className="flex h-full flex-col justify-center px-8 md:flex-row md:items-center md:gap-9 md:px-12">
              {/* Avatar Image */}
              <div className="relative mb-4 flex h-[70px] w-[70px] shrink-0 md:mb-0 xl:h-[90px] xl:w-[90px]">
                <Image
                  src={image}
                  fill
                  className="rounded-none object-cover grayscale" // Sharp corners for construction feel
                  alt={`${name} testimonial avatar`}
                  quality={100}
                />
                <div className="border-accent absolute -right-2 -bottom-2 -z-10 size-full border-2" />
              </div>

              {/* Text Content */}
              <div className="flex flex-1 flex-col gap-2">
                <p className="text-muted-foreground leading-relaxed italic md:text-base">
                  {text}
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="bg-accent h-px w-6" />
                  <p className="font-barlow text-primary text-sm font-bold tracking-wider uppercase">
                    {name}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation */}
        <SliderButton />
      </Swiper>

      {/* Hidden pagination for logic, or style it if needed */}
      <div className="swiper-custom-pagination static! mt-4 flex justify-center gap-2" />
    </div>
  );
};

const SliderButton: React.FC = () => {
  const swiper = useSwiper();
  return (
    <div className="absolute right-0 bottom-0 z-10 flex">
      <Button
        size="icon"
        variant="ghost"
        className="bg-primary hover:bg-accent hover:text-primary h-12 w-12 rounded-none text-white transition-all"
        onClick={() => swiper.slidePrev()}
        aria-label="Previous slide"
      >
        <RiArrowLeftLine />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="bg-accent text-primary hover:bg-primary h-12 w-12 rounded-none transition-all hover:text-white"
        onClick={() => swiper.slideNext()}
        aria-label="Next slide"
      >
        <RiArrowRightLine />
      </Button>
    </div>
  );
};
