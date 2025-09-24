"use client";
import Sidebar from "@/components/Sidebar";
import React, { useContext } from "react";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MyContext } from "@/context/MyContext";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const faqData = [
  {
    question: "What is Juristo?",
    answer:
      "Juristo is a platform that leverages AI to enhance legal practice, providing tools for law students, professionals, and clients to simplify complex cases and stay updated with AI-generated summaries.",
  },
  {
    question: "How can I use Juristo's services?",
    answer:
      "You can access Juristo's services by visiting their official website at [https://www.juristo.in](https://www.juristo.in). The platform offers features like research assistance, document drafting, case prediction, and an AI-powered chatbot for instant legal queries.",
  },
  {
    question: "What is the difference between a civil and criminal case?",
    answer:
      "Civil cases involve disputes between individuals or organizations over rights and obligations, while criminal cases are prosecuted by the state for actions considered harmful to society.",
  },
  {
    question: "How long does a typical lawsuit take to resolve?",
    answer:
      "The duration of a lawsuit varies based on complexity, jurisdiction, and specifics of the case, ranging from several months to several years.",
  },
  {
    question: "What is the statute of limitations and why is it important?",
    answer:
      "The statute of limitations sets the maximum time after an event within which legal proceedings may be initiated. It's crucial to ensure timely filing to preserve evidence and witness availability.",
  },
  {
    question: "What is the role of precedent in legal decision-making?",
    answer:
      "Precedent refers to previous judicial decisions that guide future cases, ensuring consistency and predictability in the legal system.",
  },
  {
    question:
      "How does alternative dispute resolution differ from traditional litigation?",
    answer:
      "Alternative dispute resolution includes methods like mediation and arbitration, offering more flexible, faster, and cost-effective solutions compared to traditional courtroom litigation.",
  },
];

const FAQPage = () => {
  const { isSidebarOpen, toggleSidebar } = useContext(MyContext);

  return (
    <div className="flex h-screen transition-all duration-300 ease-in-out">
      {/* Menu Button for Mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md dark:bg-gray-800 bg-white dark:text-white text-black"
        onClick={toggleSidebar}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          "lg:flex flex-none lg:w-1/5 h-full overflow-y-auto dark:bg-black bg-white fixed lg:static top-0 left-0 transition-transform duration-300 ease-in-out z-30",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto lg:mt-0 mt-16">
        <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
        <div className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            {faqData.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-lg font-medium transition-colors hover:text-blue-600">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pl-4 text-sm ">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <Card className="mt-8 p-4 shadow-md">
          <p className="text-center text-xs text-gray-500">
            © 2025 Juristo. All rights reserved.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default FAQPage;
