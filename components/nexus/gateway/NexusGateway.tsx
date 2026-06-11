"use client";


import { useState } from "react";

import { motion } from "framer-motion";

import RoleSelector from "./RoleSelector";

import NexusBoot from "./NexusBoot";

import { Mode } from "@/types/mode";

import { useNexus } from "@/context/NexusContext";





type Props={

setMode:(mode:Mode)=>void;

};





type AvatarMode =
"gateway" |
"sentinel" |
"lab" |
"medcore" |
"owner";





const avatarMap:Record<Mode,AvatarMode>={

gateway:"gateway",

defender:"sentinel",

lab:"lab",

medcore:"medcore",

blogs:"owner"

};








const systems:{


icon:string;

name:string;

desc:string;

mode:Mode;


}[]=[



{

icon:"🛡",

name:"SENTINEL",

desc:"Cybersecurity Intelligence Profile",

mode:"defender"

},





{

icon:"🧬",

name:"MEDCORE",

desc:"Healthcare & Pharmaceutical Intelligence",

mode:"medcore"

},






{

icon:"⚔",

name:"NEXUS LAB",

desc:"Interactive Security Environment",

mode:"lab"

},

{


icon:"📚",

name:"KNOWLEDGE ARCHIVE",

desc:"Cybersecurity blogs, research notes and learning logs",

mode:"blogs"


}



];










export default function NexusGateway({

setMode

}:Props){








// ALL HOOKS FIRST

const [booted,setBooted]=useState(false);





const {

setCurrentSystem,

setAvatar

}=useNexus();









// THEN CONDITIONS

if(!booted){



return(

<NexusBoot

complete={()=>setBooted(true)}

/>

);


}










function launchSystem(

mode:Mode

){



setCurrentSystem(mode);



setAvatar(

avatarMap[mode]

);



setMode(mode);



}









return(

<main className="

min-h-screen

bg-[radial-gradient(circle_at_top,#082f49,#020617_60%)]

text-white

flex

items-center

justify-center

font-mono

overflow-hidden

">









<div className="

max-w-7xl

w-full

px-6

py-12

">







<motion.div


initial={{

opacity:0,

y:-20

}}


animate={{

opacity:1,

y:0

}}



className="

text-center

mb-14

"

>






<h1 className="

text-6xl

tracking-widest

font-bold

">

SYED NEXUS

</h1>








<p className="

text-cyan-300

mt-5

tracking-widest

">

DIGITAL IDENTITY OPERATING SYSTEM

</p>








<p className="

text-gray-400

mt-4

">

AI powered professional intelligence environment

</p>






</motion.div>









<div>



<p className="

text-center

text-sm

text-gray-400

tracking-widest

">

SELECT VISITOR PROFILE

</p>





<RoleSelector

setMode={setMode}

/>



</div>











<section className="mt-16">








<p className="

text-center

text-sm

text-gray-400

tracking-widest

mb-8

">

OR INITIALIZE SYSTEM MANUALLY

</p>










<div className="

grid

grid-cols-1

md:grid-cols-4

gap-8

">









{systems.map(system=>(




<motion.button


key={system.name}


aria-label={`Initialize ${system.name}`}


whileHover={{

scale:1.05

}}


whileTap={{

scale:.95

}}



onClick={()=>launchSystem(system.mode)}



className="

border

border-white/20

rounded-2xl

p-8

bg-white/5

hover:bg-white/10

transition

text-left

"

>








<div

aria-hidden="true"

className="text-5xl"

>

{system.icon}

</div>








<h2 className="

text-2xl

mt-6

">

{system.name}

</h2>









<p className="

text-gray-400

mt-4

">

{system.desc}

</p>








<div className="

mt-8

text-sm

text-green-300

">

INITIALIZE →

</div>







</motion.button>



))}








</div>







</section>







</div>






</main>


);



}