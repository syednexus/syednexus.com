"use client";


import { motion } from "framer-motion";

import { useNexusData } from "@/hooks/useNexusData";





export default function CaseFiles(){



const profile = useNexusData();




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

CASE FILE DATABASE

</p>





<div className="
mt-6
space-y-5
">


{profile.projects.map(project=>(



<div

key={project.name}

className="

border
border-orange-400/20
rounded-xl
p-4

"

>


<div className="flex justify-between">


<h3>

⚔ {project.name}

</h3>


<span className="
text-xs
text-orange-300
">

{project.status}

</span>


</div>




<p className="
text-gray-400
text-sm
mt-3
">

{project.description}

</p>





<div className="
flex
gap-2
flex-wrap
mt-4
">


{project.technologies.map(tool=>(


<span

key={tool}

className="
text-xs
border
border-orange-400/20
rounded-full
px-2
py-1
"

>

{tool}

</span>


))}


</div>




</div>



))}



</div>





</motion.div>


);


}