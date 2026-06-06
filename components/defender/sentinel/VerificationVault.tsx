"use client";


import { motion } from "framer-motion";

import { useNexusData } from "@/hooks/useNexusData";





export default function VerificationVault(){



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
border-purple-400/30
rounded-2xl
p-6
bg-purple-400/5
font-mono
nexus-hover

"

>



<p className="
text-purple-300
tracking-widest
text-sm
">

VERIFICATION VAULT

</p>






<div className="
mt-6
space-y-4
">



{profile.certifications.map(cert=>(


<div

key={cert.name}

className="
border
border-purple-400/20
rounded-xl
p-4
"

>



<h3>

🛡 {cert.name}

</h3>



<p className="
text-sm
text-gray-400
mt-1
">

{cert.issuer}

</p>




<p className="
text-xs
text-purple-300
mt-2
">

{cert.status}

</p>





<div className="
flex
gap-2
flex-wrap
mt-3
">


{cert.skills.map(skill=>(


<span

key={skill}

className="
border
border-purple-400/20
rounded-full
px-2
py-1
text-xs
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