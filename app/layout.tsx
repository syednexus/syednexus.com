import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Syed Nexus | Cybersecurity Journey",
  description:
    "Personal portfolio of Syed Mohiuddin - cybersecurity learning journey, projects, homelab and technology exploration.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html
      lang="en"
      className="h-full antialiased"
    >

      <body className="min-h-full flex flex-col">
        {children}
      </body>


    </html>
  );
}
