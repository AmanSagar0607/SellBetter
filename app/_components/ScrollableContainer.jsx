'use client';

import { ScrollArea } from "@/components/ui/scroll-area";

export function ScrollableContainer({ 
  children, 
  items = [], 
  threshold = 5,
  maxHeight = 600,
  className = "" 
}) {
  return (
    <ScrollArea 
      className={`purchase-history-scroll w-full ${items.length > threshold ? `h-[${maxHeight}px]` : ''} ${className}`}
    >
      <div className="grid gap-4">
        {children}
      </div>
    </ScrollArea>
  );
}
