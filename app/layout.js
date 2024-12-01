import localFont from "next/font/local";
import Provider from "./provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import "./globals.css";
import {Funnel_Display} from 'next/font/google'
import Footer from './_components/Footer';

const AppFont = Funnel_Display({
  subsets: ['latin'],
  // weight: ['400', '500', '600', '700', '800', '900'],
})

export const metadata = {
  title: 'StoreKart',
  description: 'StoreKart - Your Digital Marketplace',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={AppFont.className}
      >
        <Provider>
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <Toaster richColors position="top-center" />
        </Provider>
      </body>
    </html>
    </ClerkProvider>
  )
}
