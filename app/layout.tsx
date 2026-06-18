import type { Metadata } from "next";

import "./globals.css";
import CookieConsent from "@/components/security/CookieConsent";

import NexusHeader from "@/components/nexus/NexusHeader";
import { NexusSoundProvider } from "@/components/nexus/NexusSound";

import NexusFooter from "@/components/nexus/NexusFooter";

import AuthProvider from "@/components/nexus/AuthProvider";

export const metadata: Metadata = {

title:"Syed Nexus | Cybersecurity Journey",

description:
"Personal portfolio of Syed Mohiuddin - cybersecurity learning journey, projects, homelab and technology exploration."

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
"
>
<AuthProvider>

<NexusSoundProvider>

<NexusHeader />


<main

className="
flex-1
pt-20
"

>

{children}

</main>

<NexusFooter />

<CookieConsent />

</NexusSoundProvider>

</AuthProvider>

</body>


</html>

);


}