"use client";


import { motion } from "framer-motion";

import { useNexusData } from "@/hooks/useNexusData";





export default function IdentityDossier(){



const profile = useNexusData();






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

IDENTITY DOSSIER

</p>






<h2 className="
text-2xl
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




</div>




</div>









<div className="mt-6">



<p className="
text-cyan-300
text-xs
">

CURRENT ROLE

</p>




<p className="
mt-2
text-gray-300
">

{profile.identity.headline}

</p>



</div>









<div className="mt-6">


<p className="
text-cyan-300
text-xs
">

PROFILE SUMMARY

</p>




<p className="
mt-2
text-gray-400
whitespace-pre-line
">

{profile.identity.summary}

</p>



</div>








<div className="mt-6">


<p className="
text-cyan-300
text-xs
">

CONTACT CHANNELS

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