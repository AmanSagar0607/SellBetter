import localFont from "next/font/local";
import Provider from "./provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import "./globals.css";
import { Outfit } from 'next/font/google';
import Footer from './_components/Footer';

const AppFont = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-outfit',
})

export const metadata = {
  title: 'SellBetter',
  description: 'SellBetter - Your Digital Marketplace',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#000000',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className={AppFont.variable} suppressHydrationWarning>
        <body className={`${AppFont.className} antialiased`} suppressHydrationWarning>
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
