import { Button } from "@/components/ui/button";
import Image from "next/image";
import Hero from "./_components/Hero";
import ProductList from "./_components/ProductList";

export default function Home() {
  return (
    <div className="bg-black min-h-screen">
      <Hero />
      <div className="w-full relative">
        {/* Background Effects for full width */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0A_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0A_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,#ffffff0A_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/5 to-transparent pointer-events-none" />
        
        <div className="relative py-16 sm:py-24">
          <ProductList />
        </div>
      </div>
    </div>
  )};