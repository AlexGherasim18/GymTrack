import type { Metadata } from "next";
import { geist } from "./ui/fonts";
import "@/app/ui/globals.css";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "GymTrack",
  description: "Fitness app to record your workouts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geist.className} antialiased`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
