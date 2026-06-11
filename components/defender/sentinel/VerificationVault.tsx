"use client";


import { motion } from "framer-motion";

import { useNexusData } from "@/hooks/useNexusData";








export default function VerificationVault(){





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

🔐 VERIFICATION VAULT

</p>








<p className="

text-gray-500

text-sm

mt-3

">

Validated learning records and professional credentials

</p>










<div className="

mt-6

space-y-4

">









{profile.certifications.map((cert,index)=>(








<div


key={`${cert.name}-${index}`}



className="

border

border-purple-400/20

rounded-xl

p-4

bg-black/20

hover:bg-purple-400/10

transition

"

>









<div className="

flex

justify-between

gap-3

"

>








<div>





<p className="

text-xs

text-purple-300

"

>

CERT-{String(index+1).padStart(3,"0")}

</p>









<h3 className="

mt-2

text-white

">

🛡 {cert.name}

</h3>






</div>









<span className="

text-xs

text-green-400

"

>

VERIFIED

</span>









</div>











<p className="

text-sm

text-gray-400

mt-3

">

Issuer: {cert.issuer}

</p>









<p className="

text-xs

text-purple-300

mt-2

">

Status: {cert.status}

</p>











<div className="

mt-4

">







<p className="

text-xs

text-purple-300

mb-2

">

UNLOCKED SKILLS

</p>










<div className="

flex

gap-2

flex-wrap

">








{(cert.skills || []).map(skill=>(








<span


key={skill}


className="

border

border-purple-400/20

rounded-full

px-2

py-1

text-xs

text-gray-300

"

>






{skill}







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