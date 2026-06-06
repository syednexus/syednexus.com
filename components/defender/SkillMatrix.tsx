"use client";

import { profile } from "@/data/profile";


export default function SkillMatrix(){


return(

<div className="
border
border-purple-400/30
rounded-2xl
bg-black/40
p-6
font-mono
">


<p className="
text-purple-300
tracking-widest
text-sm
">

CAPABILITY MATRIX

</p>


<div className="
grid
md:grid-cols-2
gap-3
mt-5
">


{profile.skills.cybersecurity.map(skill=>(


<div

key={skill}

className="
border
border-purple-400/20
rounded-lg
p-3
text-sm
"

>

✓ {skill}

</div>


))}


</div>


</div>

)

}