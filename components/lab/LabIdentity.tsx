"use client";


import { profile } from "@/data/profile";


export default function LabIdentity(){


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


<div className="flex items-center gap-6">



<img

src={profile.identity.avatar || "/profile.jpg"}

alt={profile.identity.name}

className="

w-28
h-28
rounded-full
border
border-cyan-400
object-cover

"

/>




<div>


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

{profile.identity.name}

</h1>




<p className="

text-gray-400
mt-2

">

{profile.identity.headline}

</p>





<div className="

flex
gap-3
mt-4
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



</div>


</div>



</div>

)


}