import "./globals.css";
import { Fira_Code } from "next/font/google";

const fira = Fira_Code({ subsets: ["latin"], weight: "400" });

export const metadata = {
  title: "Terminal",
  description: "A cool terminal-style portfolio built by Chirag",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${fira.className} bg-black text-green-400`}>
        {children}
      </body>
    </html>
  );
}
