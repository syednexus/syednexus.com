"use client";


import { useState } from "react";

import { motion } from "framer-motion";


import MedBoot from "./MedBoot";

import HealthcareDossier from "./HealthcareDossier";

import PharmaMatrix from "./PharmaMatrix";

import ResearchArchive from "./ResearchArchive";

import HealthCyberBridge from "./HealthCyberBridge";


import { Mode } from "@/types/mode";





type Props={

setMode:(mode:Mode)=>void;

};








export default function MedCore({

setMode

}:Props){








const [booted,setBooted]=
useState(false);









if(!booted){



return(

<MedBoot

complete={()=>setBooted(true)}

/>

);



}









return(

<main className="

min-h-screen

bg-[radial-gradient(circle_at_top,#064e3b,#020617_60%)]

text-white

font-mono

overflow-x-hidden

">









{/* HEADER */}



<header className="

h-16

px-8

flex

items-center

justify-between

border-b

border-emerald-400/20

bg-black/30

backdrop-blur

">








<div className="

text-emerald-300

tracking-widest

">

🧬 NEXUS MEDCORE

</div>









<div className="

hidden

md:block

text-xs

text-emerald-400/70

tracking-widest

">

HEALTHCARE SECURITY INTELLIGENCE ACTIVE

</div>








</header>









<section className="p-6">







{/* ACTIVE SESSION */}


<motion.div


initial={{

opacity:0,

y:20

}}


animate={{

opacity:1,

y:0

}}



className="

border

border-emerald-400/20

rounded-2xl

p-6

bg-emerald-400/5

mb-8

nexus-hover

"

>









<p className="

text-emerald-300

tracking-widest

text-sm

">

MEDCORE ACTIVE SESSION

</p>








<h1 className="

text-4xl

font-bold

mt-3

">

Healthcare Cyber Intelligence Environment

</h1>









<p className="

text-gray-400

mt-3

">

Pharmaceutical knowledge • Security engineering • Healthcare risk intelligence

</p>








</motion.div>









{/* MODULE GRID */}



<div className="

grid

grid-cols-12

gap-6

">








<div className="

col-span-12

xl:col-span-5

">

<HealthcareDossier/>

</div>









<div className="

col-span-12

xl:col-span-7

">

<PharmaMatrix/>

</div>









<div className="

col-span-12

xl:col-span-6

">

<HealthCyberBridge/>

</div>









<div className="

col-span-12

xl:col-span-6

">

<ResearchArchive/>

</div>









</div>








</section>








</main>

);



}