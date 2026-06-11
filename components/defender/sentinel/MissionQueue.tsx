"use client";


import { motion } from "framer-motion";

import { useNexus } from "@/context/NexusContext";






export default function MissionQueue(){



const {

objectives,

missionProgress,

xp

}=useNexus();









return(

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

border-red-400/30

bg-red-400/5

rounded-2xl

p-6

font-mono

nexus-hover

"

>










<p className="

text-red-300

tracking-widest

text-sm

">

🎯 MISSION QUEUE

</p>










<div className="

mt-5

space-y-3

">








{objectives.map(task=>(








<div


key={task.id}


className="

border

border-red-400/20

rounded-xl

p-3

bg-black/20

flex

justify-between

items-center

"

>








<span className="

text-sm

text-gray-300

">

&gt; {task.title}

</span>









<span className={

task.completed

?

"text-green-400 text-xs"

:

"text-yellow-400 text-xs"

}

>

{

task.completed

?

"COMPLETE"

:

"PENDING"

}

</span>









</div>








))}









</div>









{/* PROGRESS */}


<div className="

mt-6

">







<div className="

flex

justify-between

text-xs

"

>



<span className="text-red-300">

MISSION PROGRESS

</span>





<span>

{missionProgress}%

</span>




</div>









<div className="

h-2

bg-gray-800

rounded

overflow-hidden

mt-2

">







<div


style={{

width:`${missionProgress}%`

}}


className="

h-full

bg-red-400

"

/>








</div>








</div>









{/* XP */}



<p className="

text-xs

text-gray-400

mt-5

">

⚡ Nexus XP: {xp}

</p>










</motion.div>

);



}