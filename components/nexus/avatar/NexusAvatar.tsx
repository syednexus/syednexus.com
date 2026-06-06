"use client";


import { useState } from "react";

import { motion } from "framer-motion";

import { useNexus } from "@/context/NexusContext";





export default function NexusAvatar(){



const {

avatar,

visitor

}=useNexus();




const [open,setOpen]=useState(true);







const modes={


gateway:{

icon:"🌌",

name:"NEXUS GUIDE",

role:"Digital Intelligence Assistant",

outfit:"Core Interface",

message:"Welcome. Select your pathway to begin."

},






sentinel:{

icon:"🛡",

name:"SENTINEL ANALYST",

role:"Cybersecurity Profile Agent",

outfit:"Security Analyst Gear",

message:"Professional intelligence systems active."

},








lab:{

icon:"🥷",

name:"CYBER OPERATOR",

role:"Security Research Agent",

outfit:"Operator Hoodie",

message:"Lab environment initialized."

},








medcore:{

icon:"👨‍⚕️",

name:"MEDCORE SPECIALIST",

role:"Healthcare Security Agent",

outfit:"Medical Lab Coat",

message:"Healthcare intelligence online."

},









owner:{

icon:"👑",

name:"SYSTEM ARCHITECT",

role:"Nexus Administrator",

outfit:"Architect Interface",

message:"Owner privileges detected."

}



};








const current = modes[avatar];









return(

<motion.div


initial={{

opacity:0,

x:-50

}}


animate={{

opacity:1,

x:0

}}



className="

fixed

left-6

bottom-60

z-50

font-mono

"

>










{open ? (



<div className="

w-64

border

border-purple-400/40

rounded-2xl

bg-[#020617]/90

backdrop-blur-xl

p-5

shadow-xl

shadow-purple-500/20

">







<div className="

flex

justify-between

items-center

">






<p className="

text-purple-300

tracking-widest

text-sm

">

AVATAR ENGINE

</p>






<button

onClick={()=>setOpen(false)}

className="

text-gray-400

"

>

—

</button>







</div>









<motion.div


animate={{


y:[0,-8,0]


}}


transition={{


duration:3,


repeat:Infinity


}}



className="

text-center

mt-6

"

>








<div className="

text-7xl

">

{current.icon}

</div>








<h2 className="

text-purple-300

mt-4

">

{current.name}

</h2>








<p className="

text-xs

text-gray-400

mt-2

">

{current.role}

</p>









</motion.div>










<div className="

mt-6

space-y-3

text-xs

">







<p>

Visitor:

<span className="text-purple-300">

 {" "}
{visitor.toUpperCase()}

</span>

</p>









<p>

Outfit:

<span className="text-purple-300">

 {" "}
{current.outfit}

</span>

</p>









<p className="

text-gray-300

border-t

border-purple-400/20

pt-3

">

"{current.message}"

</p>









</div>









</div>



)

:

(

<button

onClick={()=>setOpen(true)}

className="

w-16

h-16

rounded-full

border

border-purple-400

bg-[#020617]

text-3xl

shadow-lg

shadow-purple-500/30

"

>


{current.icon}


</button>


)

}









</motion.div>


);


}