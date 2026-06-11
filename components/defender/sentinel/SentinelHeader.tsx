"use client";


import { motion } from "framer-motion";






export default function SentinelHeader(){








return(

<motion.header


initial={{

opacity:0,

y:-20

}}


animate={{

opacity:1,

y:0

}}



className="

h-20

px-8

flex

items-center

justify-between

border-b

border-cyan-400/20

bg-black/40

backdrop-blur-xl

font-mono

"

>









{/* LEFT SIDE */}


<div>






<div className="

text-cyan-300

tracking-widest

text-lg

">

🛡 NEXUS SENTINEL

</div>









<p className="

hidden

md:block

text-xs

text-gray-500

mt-1

tracking-widest

">

SECURITY INTELLIGENCE ENVIRONMENT

</p>








</div>












{/* CENTER */}


<div className="

hidden

lg:flex

gap-3

text-xs

text-gray-400

tracking-widest

"

>





<span>

THREAT ANALYSIS

</span>



<span>

•

</span>




<span>

SOC PATHWAY

</span>




<span>

•

</span>




<span>

CYBER PROFILE

</span>






</div>












{/* RIGHT */}


<div className="

flex

items-center

gap-3

border

border-cyan-400/20

rounded-xl

px-4

py-2

bg-cyan-400/5

"

>







<span className="

w-2

h-2

rounded-full

bg-green-400

animate-pulse

"

/>









<div>





<p className="

text-xs

text-green-400

">

ONLINE

</p>






<p className="

hidden

md:block

text-[10px]

text-gray-500

">

SESSION VERIFIED

</p>






</div>







</div>









</motion.header>


);



}