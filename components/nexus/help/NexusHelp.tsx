"use client";


import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { useNexus } from "@/context/NexusContext";






export default function NexusHelp(){



const [open,setOpen]=useState(false);



const {

setAiOpen,

setAiPrompt

}=useNexus();






const guides=[


{
icon:"🌌",
title:"Gateway",
desc:"Choose your visitor role and enter the correct Nexus environment."
},



{
icon:"🛡",
title:"Sentinel",
desc:"Cybersecurity intelligence profile including skills, projects and experience."
},




{
icon:"🧬",
title:"MedCore",
desc:"Healthcare and pharmacy background with cyber security connection."
},




{
icon:"⚔",
title:"Nexus Lab",
desc:"Hands-on cybersecurity projects, labs and technical experiments."
},




{
icon:"🤖",
title:"Nexus AI",
desc:"Interactive assistant for navigating Syed Nexus."
}



];








function askHelp(){


setAiOpen(true);


setAiPrompt(

"Explain how to navigate Syed Nexus"

);


}









return(

<div className="

fixed

right-6

top-28

z-9999

font-mono

">









<AnimatePresence>


{open && (



<motion.div


initial={{

opacity:0,

scale:.9

}}



animate={{

opacity:1,

scale:1

}}



exit={{

opacity:0,

scale:.9

}}



className="

mb-4

w-96

border

border-cyan-400/40

rounded-2xl

bg-[#020617]

p-5

shadow-xl

shadow-cyan-500/30

"

>








<div className="

flex

justify-between

items-center

">



<p className="

text-cyan-300

tracking-widest

text-sm

">

❔ NEXUS HELP

</p>





<button


onClick={()=>setOpen(false)}


className="text-gray-400"

>

✕

</button>



</div>









<p className="

text-sm

text-gray-400

mt-4

">

Welcome to the Nexus Digital Identity System.

Select a system, explore modules or ask Nexus AI.

</p>









<div className="

mt-5

space-y-3

">





{guides.map(item=>(


<div


key={item.title}


className="

border

border-cyan-400/20

rounded-xl

p-3

bg-cyan-400/5

"

>


<p className="text-cyan-200">

{item.icon} {item.title}

</p>



<p className="

text-xs

text-gray-400

mt-1

">

{item.desc}

</p>


</div>


))}



</div>









<button


onClick={askHelp}


className="

mt-5

w-full

border

border-cyan-400/40

rounded-xl

py-2

text-cyan-300

hover:bg-cyan-400/10

"

>

Ask Nexus AI

</button>






</motion.div>



)}


</AnimatePresence>









<button


onClick={()=>setOpen(prev=>!prev)}


className="

w-14

h-14

rounded-full

border

border-cyan-400

bg-[#020617]

text-xl

shadow-lg

shadow-cyan-500/30

hover:scale-110

transition

"

>

?

</button>









</div>

);



}