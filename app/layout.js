import localFont from "next/font/local";
import Provider from "./provider";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import {Funnel_Display} from 'next/font/google'

export const metadata = {
  title: "SellBetter",
  description: "Buy & Sell Digital Products",
};

const AppFont= Funnel_Display({subsets:['latin']})

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={AppFont.className}
      >
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
    </ClerkProvider>
  );
}
