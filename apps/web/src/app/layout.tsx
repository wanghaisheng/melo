import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import "./globals.css";
import "@melo/ui/styles.css";

import App from "@/web/components/app";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Melo",
  description: "Virtual Spaces for Real People",
  applicationName: "Melo",
  keywords: ["Melo", "Virtual Spaces"],
  creator: "Saphal Poudyal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased`}
      >
        <App>
          { children }
        </App>
      </body>
    </html>
  );
}
