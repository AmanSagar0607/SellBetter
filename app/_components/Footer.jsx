import React from 'react';
import Link from 'next/link';
import { IconBrandGithub, IconBrandTwitter, IconBrandLinkedin, IconMail } from '@tabler/icons-react';

function Footer() {
    return (
        <footer className="bg-[#0C0C0C] border-t border-[#1a1a1a] mt-auto">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <h2 className="text-[#EE519F] text-2xl font-bold flex items-center gap-3">
                            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Main Growth Arrow */}
                                <path d="M7 27L27 7M27 7H17M27 7V17" 
                                    stroke="#EE519F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                
                                {/* Secondary Growth Indicator */}
                                <path d="M7 19L15 11M15 11H10M15 11V16" 
                                    stroke="#EE519F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
                            </svg>
                            SellBetter
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Your ultimate platform for seamless product management and exceptional selling experience.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-[#EE519F] text-lg font-semibold">Quick Links</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/" className="text-gray-400 hover:text-[#EE519F] transition-colors duration-200">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className="text-gray-400 hover:text-[#EE519F] transition-colors duration-200">
                                    Products
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-400 hover:text-[#EE519F] transition-colors duration-200">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-400 hover:text-[#EE519F] transition-colors duration-200">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-4">
                        <h3 className="text-[#EE519F] text-lg font-semibold">Support</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/faq" className="text-gray-400 hover:text-[#EE519F] transition-colors duration-200">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="/shipping" className="text-gray-400 hover:text-[#EE519F] transition-colors duration-200">
                                    Shipping Info
                                </Link>
                            </li>
                            <li>
                                <Link href="/returns" className="text-gray-400 hover:text-[#EE519F] transition-colors duration-200">
                                    Returns
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-gray-400 hover:text-[#EE519F] transition-colors duration-200">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h3 className="text-[#EE519F] text-lg font-semibold">Connect With Us</h3>
                        <div className="flex space-x-5">
                            <a href="#" className="text-gray-400 hover:text-[#EE519F] transition-colors duration-200">
                                <IconBrandGithub className="w-6 h-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-[#EE519F] transition-colors duration-200">
                                <IconBrandTwitter className="w-6 h-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-[#EE519F] transition-colors duration-200">
                                <IconBrandLinkedin className="w-6 h-6" />
                            </a>
                            <a href="mailto:contact@sellbetter.com" className="text-gray-400 hover:text-[#EE519F] transition-colors duration-200">
                                <IconMail className="w-6 h-6" />
                            </a>
                        </div>
                        <div className="space-y-2">
                            <p className="text-gray-400 text-sm">Email: contact@sellbetter.com</p>
                            <p className="text-gray-400 text-sm">Phone: +1 (555) 123-4567</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-[#1a1a1a] mt-12 pt-8 text-center">
                    <p className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} SellBetter. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;