"use client";
import type { Metadata } from "next";
import "./globals.css";
import { SDKProvider } from "@tma.js/sdk-react";
import dynamic from "next/dynamic";


function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex justify-center items-center  bg-blue-950">
        <SDKProvider>{children}</SDKProvider>
      </body>
    </html>
  );
}

export default dynamic(() => Promise.resolve(RootLayout), { ssr: false });
