import { Pretitle } from "@/components/pretitle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ } from "@/lib/constants";
import { SECTION_IDS } from "@/lib/section-ids";

// Radix Accordion: wrapping questions (fixes mobile overflow, U6), proper
// button/region semantics and keyboard support (A9).
export const Faq = () => {
  return (
    <section id={SECTION_IDS.faq} className="bg-background py-16 xl:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-[540px] text-center xl:mb-20">
          <Pretitle text="Common Questions" center />
          <h2 className="h2 mb-4 text-foreground">
            Got Questions? We&apos;ve Got You Covered
          </h2>
          <p className="text-muted-foreground">
            From project timelines to safety protocols, we&apos;ve compiled the
            most frequent inquiries to help you understand our process.
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          className="mx-auto max-w-4xl border-border border-t"
        >
          {FAQ.map((item) => (
            <AccordionItem
              key={item.question}
              value={item.question}
              className="border-border border-b"
            >
              <AccordionTrigger className="py-6 text-left font-bold text-foreground text-lg uppercase tracking-tight hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="max-w-[90%] text-base text-muted-foreground leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
