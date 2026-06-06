"use client";


import { useState } from "react";
import { motion } from "framer-motion";

import SentinelBoot from "./sentinel/SentinelBoot";
import SentinelHeader from "./sentinel/SentinelHeader";

import IdentityDossier from "./sentinel/IdentityDossier";
import CareerTrace from "./sentinel/CareerTrace";
import CapabilityMatrix from "./sentinel/CapabilityMatrix";
import CaseFiles from "./sentinel/CaseFiles";
import VerificationVault from "./sentinel/VerificationVault";
import MissionQueue from "./sentinel/MissionQueue";

import ActivityFeed from "./ActivityFeed";
import SkillMatrix from "./SkillMatrix";

import { useNexusData } from "@/hooks/useNexusData";

import { Mode } from "@/types/mode";






type Props={

setMode:(mode:Mode)=>void;

};







export default function DefenderConsole({

setMode

}:Props){



const [booted,setBooted]=useState(false);


const profile = useNexusData();






if(!booted){


return(

<SentinelBoot

complete={()=>setBooted(true)}

/>

);


}








return(

<main className="

min-h-screen

bg-[radial-gradient(circle_at_top,#0f3057,#020617_60%)]

text-white

overflow-x-hidden

">






<SentinelHeader/>









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

mb-8

border

border-cyan-400/20

rounded-2xl

p-6

bg-cyan-400/5

backdrop-blur

font-mono

flex

justify-between

items-center

nexus-hover

"

>







<div>


<p className="

text-cyan-300

tracking-widest

text-sm

">

SENTINEL ACTIVE SESSION

</p>








<h1 className="

text-4xl

font-bold

mt-3

">

Syed Nexus Security Intelligence Platform

</h1>








<p className="

text-gray-400

mt-3

">

Digital profile analysis • Capability mapping • Security journey intelligence

</p>



</div>









{/* USER SESSION */}



<div className="

hidden

md:flex

items-center

gap-4

border

border-cyan-400/20

rounded-xl

p-4

bg-black/30

">






<img

src={profile.identity.avatar || "/profile.jpg"}

className="

w-16

h-16

rounded-full

border

border-cyan-400

object-cover

"

/>







<div>



<h3>

{profile.identity.name}

</h3>






<p className="

text-xs

text-green-400

mt-1

">

● ACTIVE ANALYST

</p>





<p className="

text-xs

text-gray-400

">

SESSION VERIFIED

</p>





</div>






</div>







</motion.div>















<div
className="

grid
grid-cols-12
gap-6

"
>


{/* LEFT COLUMN */}


<div className="

col-span-12
xl:col-span-8

space-y-6

">


<IdentityDossier/>


<CareerTrace/>


<CapabilityMatrix/>


<CaseFiles/>


</div>







{/* RIGHT COLUMN */}


<div className="

col-span-12
xl:col-span-4

space-y-6

">


<ActivityFeed/>


<SkillMatrix/>


<VerificationVault/>


<MissionQueue/>


</div>



</div>







</section>



</main>


);


}