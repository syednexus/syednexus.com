"use client";


import { motion } from "framer-motion";

import { useNexusData } from "@/hooks/useNexusData";





export default function AnalystCard(){



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

mt-6

border
border-blue-400/30
rounded-2xl

p-6

bg-blue-400/5

font-mono

nexus-hover

"

>





<div className="flex items-center gap-5">



<img

src={profile.identity.avatar || "/profile.jpg"}

alt="profile"

className="

w-20
h-20

rounded-full

border
border-blue-400

object-cover

"

/>






<div>


<p className="
text-blue-300
text-xs
tracking-widest
">

SECURITY ANALYST PROFILE

</p>




<h2 className="text-2xl mt-2">

{profile.identity.name}

</h2>




<p className="text-gray-400 text-sm mt-2">

{profile.identity.headline}

</p>



</div>


</div>








<div className="mt-6">


<p className="
text-blue-300
text-xs
">

CORE CAPABILITIES

</p>





<div className="

flex
gap-3
flex-wrap
mt-3

">





{profile.skills.cybersecurity.map(skill=>(


<span

key={skill}

className="

border
border-blue-400/30

rounded-full

px-3

py-1

text-sm

text-blue-200

"

>


{skill}


</span>



))}





</div>




</div>







</motion.div>


);


}