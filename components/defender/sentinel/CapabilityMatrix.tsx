"use client";


import { motion } from "framer-motion";

import { useNexusData } from "@/hooks/useNexusData";






export default function CapabilityMatrix(){



const profile = useNexusData();





const groups = [

{
title:"CYBERSECURITY",
items:profile.skills.cybersecurity
},


{
title:"SECURITY TOOLS",
items:profile.skills.tools
},


{
title:"NETWORKING",
items:profile.skills.networking
},


{
title:"PROGRAMMING",
items:profile.skills.programming
},


{
title:"HEALTHCARE",
items:profile.skills.pharmacy
}


];








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
border-green-400/30
rounded-2xl

p-6

bg-green-400/5

font-mono

nexus-hover

"

>







<p className="

text-green-300
tracking-widest
text-sm

">

CAPABILITY MATRIX

</p>









<div className="

mt-6

space-y-6

">






{groups.map(group=>(




<div key={group.title}>



<p className="

text-xs

text-green-400

">

{group.title}

</p>







<div className="

flex

gap-2

flex-wrap

mt-3

">





{group.items.map(skill=>(



<span


key={skill}


className="

border
border-green-400/30

rounded-full

px-3

py-1

text-sm

text-gray-300

"

>



{skill}



</span>



))}







</div>




</div>




))}






</div>








</motion.div>


);


}