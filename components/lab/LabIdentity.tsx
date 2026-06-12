"use client";


import { useNexusData } from "@/hooks/useNexusData";

import SocialLinks from "@/components/core/SocialLinks";





export default function LabIdentity(){



const profile =
useNexusData();



const identity =
profile.identity;





return(

<div className="

border
border-cyan-400/30
rounded-2xl
bg-black/40
p-6
font-mono
shadow-lg
shadow-cyan-500/10

">





<div className="

flex
flex-col
md:flex-row
items-center
md:items-start
gap-6

">







<img

src={identity.avatar || "/profile.jpg"}

alt={identity.name || "Profile"}

className="

w-28
h-28
rounded-full
border
border-cyan-400
object-cover

"

/>









<div className="flex-1">






<p className="

text-cyan-300
tracking-widest
text-sm

">

NEXUS SECURITY OPERATOR

</p>








<h1 className="

text-3xl
text-white
mt-2

">

{identity.name}

</h1>








<p className="

text-gray-400
mt-2

">

{identity.headline}

</p>







{identity.location && (

<p className="

text-gray-500
text-sm
mt-2

">

📍 {identity.location}

</p>

)}









<div className="

flex
gap-3
mt-5
flex-wrap

">








{[

"Linux",

"Networking",

"Vulnerability Assessment",

"Web Security",

"SOC Analysis"

].map(skill=>(




<span

key={skill}

className="

px-3
py-1
rounded-full
border
border-cyan-400/30
text-xs
text-cyan-300

"

>


{skill}


</span>




))}








</div>









{/* SOCIAL LINKS */}

<SocialLinks/>









</div>






</div>






</div>

);



}