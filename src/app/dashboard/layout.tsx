import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileIcon, StarIcon } from "lucide-react";
import SideNavbar from "../side-nav";


export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="container mx-auto pt-12">
      <div className="flex gap-8">
        <SideNavbar/>
        <div className="w-full">
            {children}
        </div>
      </div>
    </main>
  );
}
