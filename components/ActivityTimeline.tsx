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

w-full

min-h-65

border

border-blue-400/30

rounded-2xl

p-6

bg-black/40

backdrop-blur-xl

font-mono

shadow-lg

shadow-blue-500/10

"

>






{/* HEADER */}

<div className="

flex

justify-between

items-center

border-b

border-blue-400/10

pb-4

"

>





<div>


<p className="

text-blue-300

tracking-widest

text-sm

">

🛰 NEXUS ACTIVITY STREAM

</p>




<p className="

text-gray-500

text-xs

mt-2

">

System events and interaction history

</p>


</div>







<button


onClick={clearActivity}


className="

text-xs

text-gray-400

border

border-red-400/20

rounded-lg

px-3

py-1

hover:text-red-300

hover:bg-red-400/10

transition

"

>

CLEAR

</button>





</div>









{/* BODY */}

<div className="

mt-6

space-y-4

max-h-80

overflow-y-auto

pr-2

"

>






{

activity.length===0

?

(

<div className="

h-32

flex

items-center

justify-center

text-gray-500

text-sm

tracking-wide

"

>

No system activity recorded.

</div>

)

:

activity.map(item=>(






<motion.div


key={item.id}


initial={{

opacity:0,

x:-10

}}


animate={{

opacity:1,

x:0

}}



className="

grid

grid-cols-[120px_1fr_120px]

items-center

gap-5

border

border-blue-400/20

rounded-xl

px-5

py-4

bg-blue-400/5

hover:bg-blue-400/10

hover:border-blue-300/40

transition

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

"

>

{item.message}

</p>







<p className="

text-gray-500

text-xs

text-right

"

>

{item.time}

</p>






</motion.div>





))

}




</div>








</motion.div>

);



}