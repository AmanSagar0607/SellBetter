"use client"

import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
    {
        question: "What is SellBetter and how does it work?",
        answer: "SellBetter is a professional e-commerce platform designed to help businesses manage and sell their products effectively. Our platform provides tools for product listing, inventory management, order processing, and analytics to streamline your selling experience."
    },
    {
        question: "How do I get started with selling on SellBetter?",
        answer: "Getting started is simple! First, create your account and complete your business profile. Then, you can start adding products through our user-friendly dashboard. We provide comprehensive guides and support to help you set up your store successfully."
    },
    {
        question: "What are the fees and pricing structure?",
        answer: "We offer flexible pricing plans to suit businesses of all sizes. Our basic plan starts with essential features, while premium plans include advanced tools and priority support. Visit our pricing page for detailed information about each plan's features and costs."
    },
    {
        question: "How secure is the platform for sellers and buyers?",
        answer: "Security is our top priority. We implement industry-standard encryption, secure payment processing, and regular security audits. Your data and transactions are protected with advanced security measures, and we comply with all relevant data protection regulations."
    },
    {
        question: "What kind of support do you offer to sellers?",
        answer: "We provide comprehensive support including 24/7 customer service, detailed documentation, video tutorials, and a dedicated account manager for premium sellers. Our support team is always ready to help you with any questions or technical issues."
    }
]

function FAQ() {
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight text-[#EE519F] sm:text-4xl">
                        Frequently Asked Questions
                    </h2>
                    <p className="mx-auto max-w-xl text-lg leading-8 text-gray-400">
                        Got questions? We've got answers. If you don't find what you're looking for, feel free to contact our support team.
                    </p>
                </div>
            </div>
            <div className="mx-auto max-w-3xl mt-10">
                <Accordion type="single" collapsible className="w-full space-y-4">
                    {faqs.map((faq, index) => (
                        <AccordionItem 
                            key={index} 
                            value={`item-${index}`}
                            className="bg-[#1a1a1a] rounded-lg px-6 border-none"
                        >
                            <AccordionTrigger className="text-white hover:no-underline hover:text-[#EE519F] text-left text-lg py-6">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-400 text-base leading-relaxed">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    )
}

export default FAQ