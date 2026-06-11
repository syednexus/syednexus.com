"use client";


import { motion } from "framer-motion";

import { useActivity } from "@/hooks/useActivity";






export default function ActivityTimeline(){





const {

activity,

clearActivity

}=useActivity();








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

border-blue-400/30

rounded-2xl

p-6

bg-black/40

font-mono

shadow-lg

shadow-blue-500/10

"

>








<div className="

flex

justify-between

items-center

"

>







<p className="

text-blue-300

tracking-widest

text-sm

">

🛰 NEXUS ACTIVITY STREAM

</p>








<button


onClick={clearActivity}


className="

text-xs

text-gray-400

hover:text-red-400

"

>

CLEAR

</button>







</div>











<div className="

mt-6

space-y-4

max-h-80

overflow-y-auto

"

>










{activity.length===0 && (



<p className="

text-gray-500

text-sm

"

>

No system activity recorded.

</p>



)}












{activity.map(item=>(








<div


key={item.id}


className="

border

border-blue-400/20

rounded-xl

p-4

bg-blue-400/5

"

>










<p className="

text-blue-300

text-xs

"

>

[{item.type}]

</p>









<p className="

text-gray-300

text-sm

mt-2

"

>

{item.message}

</p>









<p className="

text-gray-500

text-xs

mt-2

"

>

{item.time}

</p>









</div>








))}









</div>








</motion.div>

);



}