"use client"

import { Toaster as Sonner } from "sonner"

const Toaster = () => {
  return (
    <Sonner
      className="toaster group fixed bottom-4 right-4"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-[#1a1a1a] group-[.toaster]:text-white group-[.toaster]:border-[#2a2a2a] group-[.toaster]:shadow-lg group-[.toaster]:mb-2",
          description: "group-[.toast]:text-gray-400",
          actionButton: "group-[.toast]:bg-[#EE519F] group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-[#2a2a2a] group-[.toast]:text-white",
        }
      }}
      position="bottom-right"
      expand={true}
      richColors={true}
      closeButton={true}
      offset="16px"
      gap="8px"
    />
  )
}

export { Toaster }