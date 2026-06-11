"use client";


import { motion } from "framer-motion";

import { useNexusData } from "@/hooks/useNexusData";








export default function CaseFiles(){






const profile =
useNexusData();









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

border-orange-400/30

rounded-2xl

p-6

bg-orange-400/5

font-mono

nexus-hover

"

>









<p className="

text-orange-300

tracking-widest

text-sm

">

🗂 SECURITY CASE FILE DATABASE

</p>








<p className="

text-gray-500

text-sm

mt-3

">

Documented security projects, research activities and technical implementations

</p>










<div className="

mt-6

space-y-5

">









{profile.projects.map((project,index)=>(








<div


key={`${project.name}-${index}`}



className="

border

border-orange-400/20

rounded-xl

p-5

bg-black/20

hover:bg-orange-400/10

transition

"

>










<div className="

flex

justify-between

gap-4

items-start

"

>








<div>






<p className="

text-xs

text-orange-300

mb-2

">

CASE-{String(index+1).padStart(3,"0")}

</p>










<h3 className="

text-lg

text-white

">

⚔ {project.name}

</h3>






</div>











<span className="

text-xs

border

border-orange-400/30

rounded-full

px-3

py-1

text-orange-300

"

>

{project.status}

</span>








</div>












<div className="

mt-5

">







<p className="

text-xs

text-orange-300

">

MISSION OBJECTIVE

</p>








<p className="

text-gray-400

text-sm

mt-2

leading-relaxed

">

{project.description}

</p>







</div>













<div className="

mt-5

">






<p className="

text-xs

text-orange-300

">

TOOLS & TECHNOLOGIES

</p>










<div className="

flex

gap-2

flex-wrap

mt-3

">







{(project.technologies || []).map(tool=>(








<span


key={tool}


className="

text-xs

border

border-orange-400/20

rounded-full

px-3

py-1

text-gray-300

"

>






{tool}







</span>








))}









</div>








</div>










</div>








))}









</div>










</motion.div>


);



}