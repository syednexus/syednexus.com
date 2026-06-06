"use client";


import { motion } from "framer-motion";

import RoleSelector from "./RoleSelector";

import { Mode } from "@/types/mode";

import { useNexus } from "@/context/NexusContext";







type Props={

setMode:(mode:Mode)=>void;

};








export default function NexusGateway({

setMode

}:Props){






const {

setCurrentSystem,

setAvatar

}=useNexus();








const systems=[


{

icon:"🛡",

name:"SENTINEL",

desc:"Cybersecurity Intelligence Profile",

mode:"defender" as Mode

},




{

icon:"🧬",

name:"MEDCORE",

desc:"Healthcare & Pharmaceutical Intelligence",

mode:"medcore" as Mode

},




{

icon:"⚔",

name:"NEXUS LAB",

desc:"Interactive Security Environment",

mode:"lab" as Mode

}



];









function launchSystem(

mode:Mode

){



setCurrentSystem(mode);




if(mode==="defender"){

setAvatar("sentinel");

}



if(mode==="lab"){

setAvatar("lab");

}



if(mode==="medcore"){

setAvatar("medcore");

}





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









{/* ROLE SELECTION */}



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










{/* MANUAL SYSTEM SELECTION */}



<div className="

mt-16

">






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

md:grid-cols-3

gap-8

">








{systems.map(system=>(



<motion.button


key={system.name}


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







<div className="

text-5xl

">

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


</div>









</div>





</main>

);



}