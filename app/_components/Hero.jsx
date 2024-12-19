// import { memo } from 'react';
// import { Button } from '@/components/ui/button';
// import { Cover } from "@/components/ui/cover";
// import { OrbitingCircles } from "@/components/ui/orbiting-circles";
// import { ShoppingCart, CreditCard, Gift, ShoppingBag } from "lucide-react";

// const CIRCLE_ICONS = [
//   {
//     Icon: ShoppingCart,
//     size: "size-[35px] sm:size-[45px] md:size-[55px] lg:size-[65px] xl:size-[75px]",
//     iconSize: "size-3 sm:size-5 md:size-6 lg:size-8 xl:size-10",
//     radius: { base: 40, sm: 80, md: 80, lg: 120, xl: 130 },
//     duration: 25,
//     delay: 20
//   },
//   {
//     Icon: CreditCard,
//     size: "size-[35px] sm:size-[45px] md:size-[55px] lg:size-[65px] xl:size-[75px]",
//     iconSize: "size-3 sm:size-5 md:size-6 lg:size-8 xl:size-10",
//     radius: { base: 40, sm: 80, md: 80, lg: 120, xl: 130 },
//     duration: 25,
//     delay: 10
//   },
//   {
//     Icon: Gift,
//     size: "size-[45px] sm:size-[60px] md:size-[75px] lg:size-[90px] xl:size-[100px]",
//     iconSize: "size-4 sm:size-6 md:size-8 lg:size-10 xl:size-12",
//     radius: { base: 80, sm: 100, md: 100, lg: 130, xl: 250 },
//     duration: 30,
//     reverse: true
//   },
//   {
//     Icon: ShoppingBag,
//     size: "size-[45px] sm:size-[60px] md:size-[75px] lg:size-[90px] xl:size-[100px]",
//     iconSize: "size-4 sm:size-6 md:size-8 lg:size-10 xl:size-12",
//     radius: { base: 80, sm: 120, md: 120, lg: 200, xl: 250 },
//     duration: 30,
//     delay: 20,
//     reverse: true
//   }
// ];

// const CircleIcon = memo(({ Icon, size, iconSize, ...props }) => (
//   <OrbitingCircles
//     className={`${size} backdrop-blur-sm border-white/20`}
//     {...props}
//   >
//     <Icon className={`${iconSize} text-white drop-shadow-lg`} strokeWidth={2.5} />
//   </OrbitingCircles>
// ));

// CircleIcon.displayName = 'CircleIcon';

// const BackgroundEffects = memo(() => (
//   <>
//     <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0A_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0A_1px,transparent_1px)] bg-[size:4rem_4rem]" />
//     <div className="absolute inset-0 bg-[radial-gradient(circle,#ffffff0A_1px,transparent_1px)] bg-[size:24px_24px]" />
//     <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-black opacity-80" />
//   </>
// ));

// BackgroundEffects.displayName = 'BackgroundEffects';

// export default function Hero() {
//   return (
//     <div className="relative bg-black p-4 sm:p-6 md:p-8 lg:p-10 px-4 sm:px-8 md:px-16 lg:px-28 xl:px-36 min-h-screen overflow-hidden">
//       <BackgroundEffects />

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 pt-10 sm:pt-16 md:pt-20 lg:pt-24 relative z-10">
//         <div className="relative">
//           <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold max-w-3xl text-white drop-shadow-lg [text-shadow:_0_2px_10px_rgba(255,255,255,0.3)]">
//             <Cover>Speed Up</Cover> Your Creative Workflow With 
//             <span className="bg-gradient-to-r from-pink-300 via-pink-400 to-pink-500 text-transparent bg-clip-text"> Storekart</span>
//           </h2>
//           <p className="text-base sm:text-lg md:text-xl text-gray-200 mt-4 md:mt-5 max-w-2xl drop-shadow [text-shadow:_0_1px_5px_rgba(255,255,255,0.2)]">
//             Join a growing family of 43,436 designers, creator and makers from around the world
//           </p>
//           <div className="flex flex-col sm:flex-row mt-6 sm:mt-8 md:mt-10 gap-4 sm:gap-5">
//             <Button className="relative bg-white text-gray-900 hover:bg-gray-100 font-semibold px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg shadow-lg transition-all hover:scale-105 hover:shadow-pink-500/20 after:absolute after:inset-0 after:z-[-1] after:bg-gradient-to-r after:from-pink-500/50 after:to-purple-500/50 after:blur-xl after:transition-all after:hover:blur-2xl">
//               Get Started
//             </Button>
//             <Button className="relative bg-transparent border border-white/20 text-white hover:bg-white/5 font-semibold px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg transition-all hover:scale-105">
//               Learn More
//             </Button>
//           </div>
//         </div>

//         <div className="relative h-[320px] sm:h-[400px] md:h-[450px] lg:h-[500px] xl:h-[600px] flex items-center justify-center mt-8 sm:mt-4 md:mt-0">
//           {CIRCLE_ICONS.map((iconProps, index) => (
//             <CircleIcon key={index} {...iconProps} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

import { memo } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Cover } from "@/components/ui/cover";
import { FlipWords } from '@/components/ui/flip-words';
import { ArrowRight, Sparkles, Code, Blocks, Palette, Box } from 'lucide-react';

const words = ["UI Kits", "Templates", "Components", "Themes"];

const BackgroundEffects = memo(() => (
  <>
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0A_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0A_1px,transparent_1px)] bg-[size:4rem_4rem]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle,#ffffff0A_1px,transparent_1px)] bg-[size:24px_24px]" />
    <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-black opacity-80" />
  </>
));

BackgroundEffects.displayName = 'BackgroundEffects';

const FeatureCard = ({ Icon, title, description }) => (
  <div className="flex flex-col items-center p-6 sm:p-8 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all hover:scale-105 hover:bg-white/10">
    <Icon className="w-8 h-8 text-pink-400 mb-4" />
    <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-400 text-sm text-center leading-relaxed">{description}</p>
  </div>
);

export default function Hero() {
  return (
    <div className="relative bg-black px-4 sm:px-8 md:px-16 lg:px-28 xl:px-36 min-h-screen overflow-hidden">
      <BackgroundEffects />

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center relative z-10 py-16 sm:py-20">
        <div className="inline-flex items-center px-4 py-2 rounded-full border border-pink-500/20 bg-pink-500/10 text-pink-400 text-sm mb-12 hover:bg-pink-500/20 transition-colors">
          <Sparkles className="w-4 h-4 mr-2" />
          Launch Offer: Zero Commission for First Month
        </div>

        <div className="space-y-6 sm:space-y-8 mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold max-w-4xl mx-auto text-white drop-shadow-lg [text-shadow:_0_2px_10px_rgba(255,255,255,0.3)]">
            <Cover>Be First</Cover> to{' '}
            <span className="bg-gradient-to-r from-pink-300 via-pink-400 to-pink-500 text-transparent bg-clip-text">
              Sell Your Digital Products
            </span>
          </h2>
          
          <div className="text-2xl sm:text-3xl lg:text-4xl font-medium text-white/90 tracking-tight">
            Start Selling Your{' '}
            <FlipWords words={words} className="text-pink-400" /> 
            <br className="sm:hidden" />
            With Zero Risk
          </div>

          <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Be among the first creators to join our new marketplace. Launch your digital products with zero commission for your first month. Limited time offer!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-16 sm:mb-20">
          <Link href="/sign-up">
            <Button className="group relative bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg shadow-lg transition-all hover:scale-105 hover:shadow-pink-500/20 after:absolute after:inset-0 after:z-[-1] after:bg-gradient-to-r after:from-pink-500/50 after:to-purple-500/50 after:blur-xl after:transition-all after:hover:blur-2xl">
              Get Started
              <ArrowRight className="inline-block ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="relative bg-transparent border border-white/20 text-white hover:bg-white/5 font-semibold px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg transition-all hover:scale-105">
              Become a Seller
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-6xl w-full">
          <FeatureCard 
            Icon={Code}
            title="Zero Commission"
            description="Launch your store with 0% commission for the first month. Keep 100% of your earnings"
          />
          <FeatureCard 
            Icon={Palette}
            title="Early Access"
            description="Get premium store placement and featured listings as one of our first sellers"
          />
          <FeatureCard 
            Icon={Blocks}
            title="Full Support"
            description="Dedicated support to help you set up your store and maximize your sales"
          />
        </div>
      </div>
    </div>
  );
}