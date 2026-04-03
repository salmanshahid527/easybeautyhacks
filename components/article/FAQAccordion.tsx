"use client";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="w-full">
      <div className="mb-8 sm:mb-9 lg:mb-10">
        <h2 className="font-display font-700 text-2xl sm:text-2xl lg:text-3xl text-foreground mb-1 sm:mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-foreground-muted text-base sm:text-base lg:text-lg leading-relaxed">
          Common questions about this topic
        </p>
      </div>

      <div className="space-y-6 sm:space-y-6 lg:space-y-7">
        {items.map((item, index) => (
          <div 
            key={index} 
            className="pb-6 sm:pb-6 lg:pb-7 border-b border-border last:border-b-0 last:pb-0 transition-colors hover:border-primary/30"
          >
            <h3 className="font-display font-semibold text-foreground text-base sm:text-base lg:text-lg mb-2 sm:mb-2.5 lg:mb-3 leading-tight">
              {index + 1}. {item.question}
            </h3>
            <p className="text-foreground text-sm sm:text-base lg:text-base leading-relaxed sm:leading-relaxed lg:leading-relaxed">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
