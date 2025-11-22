import "@ant-design/v5-patch-for-react-19";
import "@/src/styles/reset.css";
import "@/src/styles/variables.css";
import "@/src/styles/globals.css";
import SideBar from "@src/components/layout/SideBar/sideBar";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="w-full h-full flex">
            <SideBar/>
            <div className="flex-1">{children}</div>
        </div>
    );
}
import React from "react";
