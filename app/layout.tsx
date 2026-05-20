import type { Metadata } from "next"
import { Noto_Serif_KR, Noto_Sans_KR } from "next/font/google"
import "./globals.css"

const notoSerifKR = Noto_Serif_KR({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

const notoSansKR = Noto_Sans_KR({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
})

export const metadata: Metadata = {
  title: "디지털 부고",
  description: "모바일 최적화 디지털 부고 서비스",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSerifKR.variable} ${notoSansKR.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
