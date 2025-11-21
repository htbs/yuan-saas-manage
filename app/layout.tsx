import "@ant-design/v5-patch-for-react-19";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@/src/styles/reset.css";
import "@/src/styles/variables.css";
import "@/src/styles/globals.css";
import SideBar from "@/src/components/layout/sideBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "元始科技",
  description: "这是我们的B端应用",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <div className="w-full h-full flex">
            <SideBar />
            <div className="flex-1">{children}</div>
          </div>
        </AntdRegistry>
      </body>
    </html>
  );
}
import React from "react";
