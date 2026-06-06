"use client";

import { useState } from "react";

import MedBoot from "./MedBoot";
import HealthcareDossier from "./HealthcareDossier";
import PharmaMatrix from "./PharmaMatrix";
import ResearchArchive from "./ResearchArchive";
import HealthCyberBridge from "./HealthCyberBridge";

import { Mode } from "@/types/mode";
import SystemSwitcher from "@/components/core/SystemSwitcher";

type Props={

setMode:(mode:Mode)=>void;

};



export default function MedCore({setMode}:Props){


const [booted,setBooted]=useState(false);



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
bg-linear-to-br
from-[#041814]
via-[#062820]
to-[#02110d]
text-white
font-mono
">


<header className="
h-16
px-8
flex
items-center
justify-between
border-b
border-emerald-400/20
bg-black/30
">


<div className="
text-emerald-300
tracking-widest
">

🧬 NEXUS MEDCORE

</div>


</header>





<section className="
p-6
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



</section>



<SystemSwitcher

current="medcore"

setMode={setMode}

/>



</main>

)

}