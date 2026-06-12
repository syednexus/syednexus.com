"use client";


import { motion } from "framer-motion";

import { useNexusData } from "@/hooks/useNexusData";

import SocialLinks from "@/components/core/SocialLinks";







export default function HealthcareDossier(){



const profile =
useNexusData();



const emails =

Array.isArray(profile.identity.email)

?

profile.identity.email

:

profile.identity.email

?

[profile.identity.email]

:

[];







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
border-emerald-400/30
rounded-2xl
p-6
bg-emerald-400/5
h-full
font-mono
shadow-lg
shadow-emerald-500/10
nexus-hover

"

>










{/* HEADER */}


<p className="

text-emerald-300
tracking-widest
text-sm

">

🧬 MEDICAL INTELLIGENCE DOSSIER

</p>









{/* PROFILE */}



<div className="

flex
items-center
gap-5
mt-8

">







<img

src={profile.identity.avatar || "/profile.jpg"}

alt={profile.identity.name}

className="

w-24
h-24
rounded-full
border
border-emerald-400
object-cover

"

/>









<div>



<h2 className="text-2xl">

{profile.identity.name}

</h2>






<p className="

text-gray-400
text-sm
mt-2

">

{profile.identity.headline}

</p>






<p className="

text-green-400
text-xs
mt-3

">

● Healthcare Security Profile Active

</p>




</div>




</div>









{/* CONTACT */}



<div className="

mt-8
border
border-emerald-400/20
rounded-xl
p-5
bg-black/30

">



<p className="

text-emerald-300
tracking-widest
text-xs

">

SECURE CONTACT CHANNELS

</p>





{emails.map(mail=>(


<p

key={mail}

className="

text-gray-400
text-sm
mt-3

"

>

📧 {mail}

</p>


))}





<SocialLinks/>




</div>









{/* BRIDGE */}



<div className="

mt-8
border
border-emerald-400/20
rounded-xl
p-5
bg-black/30

">



<p className="

text-emerald-300
text-xs
tracking-widest

">

CAREER CONVERGENCE

</p>






<p className="

text-gray-300
text-sm
mt-3

">

Pharmaceutical background combined with cybersecurity engineering,
focused on protecting healthcare systems, clinical data and digital
health infrastructure.

</p>



</div>









{/* EDUCATION */}



<div className="mt-10">



<p className="

text-emerald-300
tracking-widest
text-xs
mb-5

">

ACADEMIC RECORDS

</p>






<div className="space-y-4">



{(profile.education || []).map(edu=>(



<div

key={edu.degree}

className="

border
border-emerald-400/20
rounded-xl
p-4
bg-black/20

"

>



<h3>

🎓 {edu.degree}

</h3>





<p className="

text-gray-400
text-sm
mt-1

">

{edu.institution}

</p>





<p className="

text-gray-500
text-xs
mt-2

">

{edu.period}

</p>



</div>



))}




</div>



</div>










{/* HEALTHCARE SKILLS */}



<div className="mt-10">



<p className="

text-emerald-300
tracking-widest
text-xs
mb-5

">

CLINICAL CAPABILITY MATRIX

</p>







<div className="flex flex-wrap gap-3">



{(profile.skills.pharmacy || []).map(skill=>(



<span

key={skill}

className="

border
border-emerald-400/30
rounded-full
px-3
py-1
text-sm
text-emerald-200

"

>

{skill}

</span>



))}



</div>



</div>











{/* CERTIFICATIONS */}



<div className="mt-10">



<p className="

text-emerald-300
tracking-widest
text-xs
mb-5

">

CERTIFICATION VAULT

</p>






<div className="space-y-3">



{(profile.certifications || []).map(cert=>(



<div

key={cert.name}

className="

border
border-emerald-400/20
rounded-xl
p-4
bg-black/20

"

>



<h3>

🛡 {cert.name}

</h3>





<p className="

text-gray-500
text-xs
mt-1

">

{cert.issuer}

</p>




</div>



))}



</div>



</div>








</motion.div>

);



}