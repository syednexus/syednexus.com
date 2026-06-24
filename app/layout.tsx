import type { Metadata } from "next";

import "./globals.css";
import CookieConsent from "@/components/security/CookieConsent";

import NexusHeader from "@/components/nexus/NexusHeader";
import { NexusSoundProvider } from "@/components/nexus/NexusSound";

import NexusFooter from "@/components/nexus/NexusFooter";

import AuthProvider from "@/components/nexus/AuthProvider";

import { NexusDataProvider } from "@/context/NexusDataContext";
import { MissionsProvider } from "@/context/MissionsContext";
import { AnalystProvider } from "@/context/AnalystContext";
import { WorldProvider } from "@/context/WorldContext";

import NexusAvatar from "@/components/nexus/avatar/NexusAvatar";

import AchievementOverlay from "@/components/mission/AchievementOverlay";
import NexusDataStatusBar from "@/components/mission/NexusDataStatusBar";

import { NexusProvider } from "@/context/NexusContext";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://syednexus.com";

export const metadata: Metadata = {
  title: "Syed Nexus | Cybersecurity Portfolio & Lab",
  description:
    "Cybersecurity portfolio, SOC simulations, security research and projects.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Syed Nexus | Cybersecurity Portfolio & Lab",
    description:
      "Cybersecurity portfolio, SOC simulations, security research and projects.",
    url: siteUrl,
    siteName: "Syed Nexus",
    locale: "en_AU",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Syed Nexus | Cybersecurity Portfolio & Lab",
    description:
      "Cybersecurity portfolio, SOC simulations, security research and projects."
  },
  robots: {
    index: true,
    follow: true
  },
  icons: {
    icon: "/profile.jpg",
    apple: "/profile.jpg"
  }
};






export default function RootLayout({

children,

}: Readonly<{

children:React.ReactNode;

}>){



return (

<html
lang="en"
data-scroll-behavior="smooth"
className="h-full antialiased"
>


<body
className="
min-h-full
flex
flex-col
overflow-x-hidden
"
>
<AuthProvider>

<NexusDataProvider>

<MissionsProvider>

<AnalystProvider>

<WorldProvider>

<NexusProvider>

<NexusSoundProvider>


<NexusHeader />


<NexusDataStatusBar />


<main
className="
flex-1
pt-20
"
>

{children}

</main>


<NexusFooter />


<NexusAvatar />


<AchievementOverlay />


<CookieConsent />


</NexusSoundProvider>

</NexusProvider>

</WorldProvider>

</AnalystProvider>

</MissionsProvider>

</NexusDataProvider>

</AuthProvider>

</body>


</html>

);


}