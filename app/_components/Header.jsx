import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';
import { ShoppingBag, User } from 'lucide-react';
import React from 'react';
import Link from 'next/link';

function Header() {
    const MenuList = [
        { name: "Home", path: "/" },
        { name: "Store", path: "/store" },
        { name: "Products", path: "/products" },
        { name: "Explore", path: "/explore" },
    ]
    return (
        <div className="sticky top-0 z-50 bg-black">
            <div className="flex p-4 px-8 md:px-32 lg:px-36 justify-between items-center border-b border-white/10">
            <h2 className="text-[28px] font-bold">
                    <span className="bg-gradient-to-r from-pink-300 via-pink-400 to-pink-500 text-transparent bg-clip-text">
                      SellBetter
                    </span>
                </h2>

                <nav>
                    <ul className="flex gap-8">
                        {MenuList.map((menu, index) => (
                            <li key={index}>
                                <Link 
                                    href={menu.path}
                                    className="relative px-2 py-1 text-md text-white/70 transition-colors hover:text-white"
                                >
                                    {menu.name}
                                    <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-white/50 to-transparent scale-x-0 transition-transform duration-300 hover:scale-x-100" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="flex items-center gap-5">
                    <button className="relative group p-2">
                        <ShoppingBag className="size-5 text-white/70 group-hover:text-white transition-colors" />
                        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-white/10 text-[10px] font-medium text-white">0</span>
                    </button>
                    <Button 
                        className="relative group px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors duration-300"
                    >
                        Sell Product
                        <div className="absolute inset-0 bg-white/5 -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Button>
                    <UserButton />
                </div>
            </div>
        </div>
    );
}

export default Header;