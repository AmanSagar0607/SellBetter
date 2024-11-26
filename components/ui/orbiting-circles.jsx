"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function OrbitingCircles({
  className,
  children,
  reverse,
  duration = 20,
  delay = 10,
  radius = { base: 50 },
  path = true,
}) {
  const [currentRadius, setCurrentRadius] = useState(radius.base);

  useEffect(() => {
    const updateRadius = () => {
      const width = window.innerWidth;
      if (width >= 1280) setCurrentRadius(radius.xl || radius.lg || radius.md || radius.sm || radius.base);
      else if (width >= 1024) setCurrentRadius(radius.lg || radius.md || radius.sm || radius.base);
      else if (width >= 768) setCurrentRadius(radius.md || radius.sm || radius.base);
      else if (width >= 640) setCurrentRadius(radius.sm || radius.base);
      else setCurrentRadius(radius.base);
    };

    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, [radius]);

  return (
    <>
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <circle
            className="stroke-[#FFB6C1] stroke-[3px] dark:stroke-[#FFB6C1] opacity-50"
            cx="50%"
            cy="50%"
            r={currentRadius}
            fill="none"
          />
        </svg>
      )}

      <div
        style={{
          "--duration": duration,
          "--radius": currentRadius,
          "--delay": -delay,
        }}
        className={cn(
          "absolute flex size-full transform-gpu animate-orbit items-center justify-center rounded-full border-2 border-[#FFB6C1] bg-[#FFB6C1]/20 [animation-delay:calc(var(--delay)*1000ms)] dark:border-[#FFB6C1] dark:bg-[#FFB6C1]/20",
          { "[animation-direction:reverse]": reverse },
          className,
        )}
      >
        {children}
      </div>
    </>
  );
}
