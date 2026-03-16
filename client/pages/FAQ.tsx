import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "What is Skill E-School?",
      answer: "Skill E-School is a blended learning platform that offers courses, webinars, and mentorship to help individuals and franchises master modern skills."
    },
    {
      question: "How do I enroll in a course?",
      answer: "You can enroll in a course by browsing our Courses page and clicking 'Enroll Now' on the course card. If the course is paid, you'll be prompted to complete the payment."
    },
    {
      question: "Are the webinars live?",
      answer: "Yes, our webinars are conducted live by industry experts, giving you the opportunity to ask questions and interact in real-time."
    },
    {
      question: "How can I become a franchise partner?",
      answer: "Visit our Franchise page to learn about the benefits of partnering with Skill E-School and submit an inquiry through the form."
    },
    {
      question: "Who can I contact for support?",
      answer: "If you have any issues, you can reach out through our Contact Us page or email support@skill-eschool.com."
    }
  ];

  return (
    <div className="container py-16 max-w-3xl border-2 rounded-2xl bg-white/50 backdrop-blur-sm shadow-sm md:my-10">
      <div className="space-y-4 text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Frequently Asked Questions</h1>
        <p className="text-muted-foreground">
          Find answers to common questions about our platform and services.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left font-medium">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQ;
