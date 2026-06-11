"use client";


import { motion } from "framer-motion";

import { useNexusData } from "@/hooks/useNexusData";







export default function IdentityDossier(){





const profile =
useNexusData();





const latestEducation =
profile.education?.[0];



const latestExperience =
profile.experience?.[0];








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



<div className="flex gap-5 items-center">







<img


src={profile.identity.avatar || "/profile.jpg"}


alt={profile.identity.name}


className="

w-24

h-24

rounded-full

border

border-cyan-400

object-cover

"

/>









<div>





<p className="

text-cyan-300

text-xs

tracking-widest

">

🛡 IDENTITY DOSSIER

</p>









<h2 className="

text-3xl

mt-2

">

{profile.identity.name}

</h2>








<p className="

text-sm

text-gray-400

mt-2

">

{profile.identity.location}

</p>







<p className="

text-xs

text-green-400

mt-3

">

● ACTIVE CYBERSECURITY PROFILE

</p>






</div>






</div>









{/* SECURITY TRACK */}



<div className="

grid

grid-cols-1

md:grid-cols-3

gap-4

mt-8

">









<div className="

border

border-cyan-400/20

rounded-xl

p-4

bg-black/30

">




<p className="text-cyan-300 text-xs">

PRIMARY TRACK

</p>



<p className="text-gray-300 mt-2">

SOC Analyst Pathway

</p>




</div>









<div className="

border

border-cyan-400/20

rounded-xl

p-4

bg-black/30

">




<p className="text-cyan-300 text-xs">

DOMAIN EDGE

</p>



<p className="text-gray-300 mt-2">

Healthcare + Cybersecurity

</p>




</div>










<div className="

border

border-cyan-400/20

rounded-xl

p-4

bg-black/30

">




<p className="text-cyan-300 text-xs">

STATUS

</p>



<p className="text-gray-300 mt-2">

Building Security Capability

</p>




</div>








</div>











{/* CURRENT ROLE */}


<section className="mt-8">




<p className="

text-cyan-300

text-xs

">

CURRENT INTELLIGENCE PROFILE

</p>






<p className="

mt-3

text-gray-300

">

{profile.identity.headline}

</p>




</section>









{/* SUMMARY */}



<section className="mt-8">




<p className="

text-cyan-300

text-xs

">

ANALYST SUMMARY

</p>







<p className="

mt-3

text-gray-400

leading-relaxed

whitespace-pre-line

">

{profile.identity.summary}

</p>






</section>











{/* TRACE */}



<div className="

grid

grid-cols-1

md:grid-cols-2

gap-4

mt-8

">









<div className="

border

border-white/10

rounded-xl

p-4

bg-black/20

">




<p className="

text-cyan-300

text-xs

">

LATEST EDUCATION

</p>




<p className="

text-gray-300

mt-2

">

{latestEducation?.degree}

</p>






</div>










<div className="

border

border-white/10

rounded-xl

p-4

bg-black/20

">




<p className="

text-cyan-300

text-xs

">

OPERATION TRACE

</p>




<p className="

text-gray-300

mt-2

">

{latestExperience?.role}

</p>





</div>









</div>











{/* CONTACT */}



<div className="mt-8">





<p className="

text-cyan-300

text-xs

">

SECURE CONTACT CHANNELS

</p>






{profile.identity.email.map(mail=>(




<p


key={mail}


className="

text-gray-400

text-sm

mt-2

"

>


{mail}


</p>





))}







</div>










</motion.div>

);


}