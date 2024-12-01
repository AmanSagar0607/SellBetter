import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';
import { ShoppingBag, Menu, X } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    const MenuList = [
        { name: "Home", path: "/" },
        { name: "Store", path: "/store" },
        { name: "Products", path: "/products" },
        { name: "Explore", path: "/explore" },
    ];

    const toggleMenu = useCallback(() => {
        setIsMenuOpen(prev => !prev);
    }, []);

    // Prevent scroll when menu is open
    useEffect(() => {
        if (!isMounted) return;
        
        document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen, isMounted]);

    const menuVariants = {
        closed: {
            opacity: 0,
            height: 0,
            transition: {
                duration: 0.2,
                ease: "easeInOut"
            }
        },
        open: {
            opacity: 1,
            height: "auto",
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    const menuItemVariants = {
        closed: { opacity: 0, x: -20 },
        open: { opacity: 1, x: 0 }
    };

    return (
        <div className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm">
            <div className="relative flex p-4 px-4 sm:px-8 lg:px-32 xl:px-36 justify-between items-center border-b border-white/10">
            <h2 className="text-[22px] sm:text-[28px] font-bold shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
                        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Main Growth Arrow */}
                            <path d="M7 27L27 7M27 7H17M27 7V17" 
                                stroke="#EE519F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            
                            {/* Secondary Growth Indicator */}
                            <path d="M7 19L15 11M15 11H10M15 11V16" 
                                stroke="#EE519F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
                        </svg>
                        <span className="text-[#EE519F]">
                            SellBetter
                        </span>
                    </Link>
                </h2>

                {/* Desktop Navigation */}
                <nav className="hidden lg:block flex-grow justify-center">
                    <ul className="flex gap-8 justify-center">
                        {MenuList.map((menu, index) => (
                            <li key={index}>
                                <Link 
                                    href={menu.path}
                                    className="relative px-2 py-1 text-md text-white/70 hover:text-white transition-colors duration-200"
                                >
                                    {menu.name}
                                    <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-white/50 to-transparent scale-x-0 transition-transform duration-300 hover:scale-x-100" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="flex items-center gap-2 sm:gap-5 shrink-0">
                    <button className="relative group p-2">
                        <ShoppingBag className="size-5 text-white/70 group-hover:text-white transition-colors" />
                        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-white/10 text-[10px] font-medium text-white">0</span>
                    </button>
                    <Link href="/dashboard" className="hidden sm:block">
                        <Button 
                            className="relative group px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors duration-300"
                        >
                            Sell Product
                            <div className="absolute inset-0 bg-white/5 -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Button>
                    </Link>
                    <UserButton 
                        fallbackRedirectUrl="/"
                        appearance={{
                            elements: {
                                avatarBox: "size-8 sm:size-9"
                            }
                        }}
                    />
                    {/* Mobile Menu Button */}
                    <button 
                        onClick={toggleMenu}
                        className="lg:hidden p-2 text-white/70 hover:text-white transition-colors"
                        aria-label="Toggle menu"
                    >
                        <motion.div
                            animate={isMenuOpen ? "open" : "closed"}
                            variants={{
                                open: { rotate: 180 },
                                closed: { rotate: 0 }
                            }}
                            transition={{ duration: 0.2 }}
                        >
                            {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                        </motion.div>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence mode="wait">
                {isMenuOpen && isMounted && (
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                        className="fixed lg:hidden inset-x-0 top-[73px] bg-black/95 backdrop-blur-sm border-b border-white/10 max-h-[calc(100vh-73px)] overflow-auto"
                    >
                        <nav className="px-4 py-6">
                            <motion.ul 
                                className="flex flex-col gap-4"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                {MenuList.map((menu, index) => (
                                    <motion.li 
                                        key={index}
                                        variants={menuItemVariants}
                                        initial="closed"
                                        animate="open"
                                        transition={{ delay: 0.1 + index * 0.1 }}
                                    >
                                        <Link 
                                            href={menu.path}
                                            onClick={toggleMenu}
                                            className="block px-4 py-3 text-lg text-white/70 hover:text-white transition-colors hover:bg-white/5 rounded-md"
                                        >
                                            {menu.name}
                                        </Link>
                                    </motion.li>
                                ))}
                                <motion.li
                                    variants={menuItemVariants}
                                    initial="closed"
                                    animate="open"
                                    transition={{ delay: 0.5 }}
                                >
                                    <Link 
                                        href="/dashboard"
                                        onClick={toggleMenu}
                                        className="block px-4 py-3 text-lg text-white/70 hover:text-white transition-colors hover:bg-white/5 rounded-md"
                                    >
                                        Sell Product
                                    </Link>
                                </motion.li>
                            </motion.ul>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Header;