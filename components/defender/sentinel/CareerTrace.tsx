"use client";


import { motion } from "framer-motion";

import { useNexusData } from "@/hooks/useNexusData";







export default function CareerTrace(){



const profile =
useNexusData();







return(

<motion.div


initial={{

opacity:0,

x:20

}}


animate={{

opacity:1,

x:0

}}



className="

border

border-cyan-400/30

rounded-2xl

p-6

bg-cyan-400/5

backdrop-blur

font-mono

nexus-hover

"

>









{/* HEADER */}


<p className="

text-cyan-300

tracking-widest

text-sm

">

🛰 CAREER TRACE LOG

</p>








<p className="

text-gray-500

text-sm

mt-3

">

Professional evolution timeline and operational history

</p>










{/* TIMELINE */}



<div className="

mt-8

space-y-6

">








{profile.experience.map((job,index)=>(









<div


key={`${job.role}-${job.company}-${index}`}



className="

relative

border-l-2

border-cyan-400/40

pl-6

"

>










{/* NODE */}


<div className="

absolute

- left-2.25

top-0

w-4

h-4

rounded-full

bg-cyan-400

"

/>










<div className="

flex

justify-between

gap-5

items-start

"

>








<div>







<p className="

text-xs

text-cyan-300

mb-2

">

TRACE-{String(index+1).padStart(3,"0")}

</p>










<h3 className="

text-lg

text-white

">

{job.role}

</h3>










<p className="

text-cyan-300

text-sm

mt-1

">

{job.company}

</p>








</div>










<span className="

text-xs

text-gray-500

"

>

{job.period}

</span>








</div>











{/* DOMAIN */}


<p className="

inline-block

mt-4

text-xs

border

border-cyan-400/30

rounded-full

px-3

py-1

text-cyan-300

"

>

{job.domain}

</p>











{/* DETAILS */}



<ul className="

mt-5

space-y-2

">








{(job.details || []).map((detail,i)=>(









<li


key={`${detail}-${i}`}


className="

text-gray-400

text-sm

leading-relaxed

"

>

▸ {detail}

</li>








))}










</ul>









</div>








))}









</div>











{/* TRANSITION FOOTER */}



<div className="

mt-8

border

border-cyan-400/20

rounded-xl

p-4

bg-black/20

"

>







<p className="

text-xs

text-cyan-300

">

CAREER TRANSITION PATH

</p>









<p className="

text-gray-400

text-sm

mt-3

">

Pharmaceutical knowledge → Operational leadership → Cybersecurity engineering and security analysis

</p>







</div>










</motion.div>

);



}