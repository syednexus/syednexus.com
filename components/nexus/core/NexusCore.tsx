"use client";


import { useState } from "react";

import { motion } from "framer-motion";

import { useNexus } from "@/context/NexusContext";






export default function NexusCore(){



const {

visitor,

currentSystem,

mission,

missionProgress,

xp,

achievements

}=useNexus();




const [open,setOpen]=useState(false);







return(

<motion.div

initial={{

opacity:0,

x:-40

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

font-mono

"

>








{/* COLLAPSED CARD */}



{!open && (


<button

onClick={()=>setOpen(true)}


className="

w-72

border

border-cyan-400/40

rounded-2xl

bg-black/80

backdrop-blur-xl

p-5

text-left

shadow-lg

shadow-cyan-500/20

hover:border-cyan-300

transition-all

"

>



<div className="flex gap-4 items-center">



<div className="

w-14

h-14

rounded-xl

bg-cyan-400/20

flex

items-center

justify-center

text-3xl

">

🌌

</div>






<div>


<p className="

text-cyan-300

tracking-widest

">

NEXUS CORE

</p>



<p className="

text-xs

text-gray-400

">

Identity engine online

</p>


</div>



</div>






<p className="

mt-5

text-green-400

text-sm

">

● All systems operational

</p>





<p className="

text-xs

text-gray-500

mt-3

">

Click to expand ↗

</p>



</button>

)}









{/* EXPANDED */}



{open && (



<div

className="

w-96

border

border-cyan-400/40

rounded-2xl

bg-black/90

backdrop-blur-xl

p-6

shadow-xl

shadow-cyan-500/20

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

">

NEXUS COMMAND CORE

</p>






<button

onClick={()=>setOpen(false)}

className="text-gray-400"

>

—

</button>



</div>









<div className="

mt-6

space-y-5

text-sm

">






<div>


<p className="text-gray-500">

VISITOR PROFILE

</p>


<p>

{visitor.toUpperCase()}

</p>


</div>








<div>


<p className="text-gray-500">

ACTIVE SYSTEM

</p>


<p>

{currentSystem.toUpperCase()}

</p>


</div>








<div>


<p className="text-gray-500">

CURRENT MISSION

</p>


<p>

{mission}

</p>



<div className="

h-2

bg-gray-800

rounded

mt-3

overflow-hidden

">



<div

style={{

width:`${missionProgress}%`

}}


className="

h-full

bg-cyan-400

"

/>



</div>



<p className="

text-xs

text-cyan-300

mt-1

">

{missionProgress}% COMPLETE

</p>




</div>









<div>


<p className="text-gray-500">

NEXUS XP

</p>


<p>

⚡ {xp}

</p>


</div>










<div>



<p className="text-gray-500">

ACHIEVEMENTS

</p>





{

achievements.length===0

?

<p className="text-gray-400">

No achievements unlocked

</p>


:


achievements.map(item=>(



<p key={item.id}>

{item.icon} {item.title}

</p>



))

}





</div>









<div className="

pt-5

border-t

border-cyan-400/20

flex

gap-3

">



<button className="core-btn">

Resume

</button>



<button className="core-btn">

Contact

</button>



<button className="core-btn">

Report

</button>




</div>





</div>





</div>


)}





</motion.div>


);



}