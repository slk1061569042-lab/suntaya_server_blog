import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Git 文档 - 完整的 Git 学习指南",
  description: "详细的 Git 教程，包含冲突解决、工作流程、暂存区等核心概念",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased bg-[#F8FAFC] text-[#1E293B]">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
