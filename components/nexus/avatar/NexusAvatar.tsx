"use client";


import { motion } from "framer-motion";

import { useNexus } from "@/context/NexusContext";




export default function NexusAvatar(){


const {

avatar

}=useNexus();





const styles={

gateway:{
emoji:"🌌",
title:"NEXUS CORE",
desc:"Digital identity system online"
},


sentinel:{
emoji:"🛡",
title:"SENTINEL ANALYST",
desc:"Professional intelligence mode"
},


lab:{
emoji:"⚔",
title:"CYBER OPERATOR",
desc:"Security research mode"
},


medcore:{
emoji:"🧬",
title:"MEDICAL ANALYST",
desc:"Healthcare intelligence mode"
},


owner:{
emoji:"👑",
title:"SYSTEM ARCHITECT",
desc:"Owner privileges active"
}

};




const current=styles[avatar];






return(

<motion.div

initial={{
opacity:0,
x:50
}}

animate={{
opacity:1,
x:0
}}


className="
fixed
bottom-6
left-6
z-50

border
border-cyan-400/30

rounded-2xl

bg-black/70

backdrop-blur

p-4

font-mono

w-64

shadow-lg
shadow-cyan-500/20
"

>



<div className="
text-5xl
">

{current.emoji}

</div>





<p className="
text-cyan-300
mt-3
text-sm
tracking-widest
">

{current.title}

</p>





<p className="
text-xs
text-gray-400
mt-2
">

{current.desc}

</p>





</motion.div>

);

}