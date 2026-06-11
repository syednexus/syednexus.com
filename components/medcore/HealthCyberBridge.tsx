"use client";


import { motion } from "framer-motion";

import { medcore } from "@/data/medcore";







export default function HealthCyberBridge(){







const bridges =
medcore.cyberBridge || [];









return(

<motion.div


initial={{

opacity:0,

x:-20

}}


animate={{

opacity:1,

x:0

}}



className="

h-full

border

border-cyan-400/30

rounded-2xl

bg-black/40

p-6

font-mono

shadow-lg

shadow-cyan-500/10

nexus-hover

"

>









{/* HEADER */}



<p className="

text-cyan-300

tracking-widest

text-sm

">

🛡 HEALTHCARE × CYBER BRIDGE

</p>








<p className="

text-xs

text-gray-400

mt-3

">

Mapping clinical environments into cybersecurity controls

</p>












<div className="

space-y-4

mt-8

"

>









{bridges.map((link,index)=>(








<motion.div


key={`${link.healthcare}-${index}`}


whileHover={{

scale:1.03

}}



className="

border

border-cyan-400/20

rounded-xl

p-5

bg-cyan-400/5

"

>











<div className="

flex

items-center

justify-between

gap-5

"

>










<div className="flex-1">








<p className="

text-emerald-300

text-sm

">

HEALTHCARE DOMAIN

</p>









<h3 className="mt-2">

🧬 {link.healthcare}

</h3>








</div>











<div className="

text-cyan-300

text-xl

"

>

→

</div>












<div className="flex-1">








<p className="

text-cyan-300

text-sm

">

SECURITY CONTROL

</p>










<h3 className="mt-2">

🛡 {link.security}

</h3>









</div>










</div>











</motion.div>








))}










</div>











</motion.div>

);



}