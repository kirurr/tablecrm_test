import { Geist, Geist_Mono } from "next/font/google"
// import Script from "next/script";

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "@/components/providers"
import { cn } from "@/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
			<head>
        {/* <Script */}
        {/*   src="//unpkg.com/react-scan/dist/auto.global.js" */}
        {/*   crossOrigin="anonymous" */}
        {/*   strategy="beforeInteractive" */}
        {/* /> */}
      </head>
      <body>
        <Providers>
          <ThemeProvider>{children}</ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
