import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import {WTThemeProvider} from "./components/layout/theme/ThemeContext";
import WTAppBar from "./components/layout/WTAppBar";
import {Box} from "@mui/material";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Web Tree",
  description: "A simple web scraper",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>

        <WTThemeProvider >
            <WTAppBar />
            
            <Box mt={2}>
                {children}
            </Box>
        </WTThemeProvider>

      </body>
    </html>
  );
}
