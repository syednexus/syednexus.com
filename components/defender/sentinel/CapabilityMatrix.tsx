"use client";


import { motion } from "framer-motion";

import { useNexusData } from "@/hooks/useNexusData";






export default function CapabilityMatrix(){



const profile =
useNexusData();







const readiness = [

{

name:"Networking Fundamentals",

level:75

},


{

name:"Security Operations",

level:65

},


{

name:"Vulnerability Assessment",

level:70

},


{

name:"Linux Environment",

level:65

},


{

name:"Governance & Risk",

level:70

}


];










const groups = [


{

title:"SECURITY STACK",

items:profile.skills.tools

},



{

title:"CYBER KNOWLEDGE",

items:profile.skills.cybersecurity

},



{

title:"PROGRAMMING",

items:profile.skills.programming

},



{

title:"DOMAIN ADVANTAGE",

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

⚡ SENTINEL CAPABILITY MATRIX

</p>










{/* READINESS */}


<div className="

mt-6

space-y-5

">






{readiness.map(item=>(





<div key={item.name}>






<div className="

flex

justify-between

text-sm

mb-2

">



<span className="text-gray-300">

{item.name}

</span>




<span className="text-green-300">

{item.level}%

</span>






</div>







<div className="

h-2

bg-gray-800

rounded

overflow-hidden

">






<div


style={{

width:`${item.level}%`

}}


className="

h-full

bg-green-400

"

/>






</div>








</div>






))}






</div>









{/* SKILL GROUPS */}



<div className="

mt-8

space-y-6

">








{groups.map(group=>(








<div key={group.title}>






<p className="

text-xs

text-green-400

tracking-widest

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

bg-black/20

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