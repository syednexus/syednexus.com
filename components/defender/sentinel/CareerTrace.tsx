"use client";


import { motion } from "framer-motion";

import { useNexusData } from "@/hooks/useNexusData";





export default function CareerTrace(){



const profile = useNexusData();





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






<p className="

text-cyan-300
tracking-widest
text-sm

">

CAREER TRACE LOG

</p>








<div className="

mt-6

space-y-5

">



{profile.experience.map(job=>(



<div

key={job.role + job.company}

className="

border-l-2
border-cyan-400/40

pl-5

"

>




<div className="flex justify-between gap-5">



<h3 className="

text-lg
text-white

">

{job.role}

</h3>




<span className="

text-xs
text-gray-500

">

{job.period}

</span>




</div>






<p className="

text-cyan-300
text-sm

">

{job.company}

</p>





<p className="

text-gray-500
text-xs
mt-1

">

{job.domain}

</p>







<ul className="

mt-3

space-y-2

">



{job.details.map(detail=>(



<li

key={detail}

className="

text-gray-400

text-sm

"

>

▸ {detail}

</li>



))}



</ul>






</div>




))}




</div>





</motion.div>


);


}