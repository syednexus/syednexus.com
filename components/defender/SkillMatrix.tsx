"use client";


import { useNexusData } from "@/hooks/useNexusData";






export default function SkillMatrix(){



const profile =
useNexusData();






const analystAreas=[

{
name:"Security Monitoring",
status:"Learning"
},

{
name:"Vulnerability Analysis",
status:"Active"
},

{
name:"Network Investigation",
status:"Active"
},

{
name:"Incident Response",
status:"Developing"
}

];









return(

<div

className="

border

border-purple-400/30

rounded-2xl

bg-black/40

p-6

font-mono

nexus-hover

"

>







<p className="

text-purple-300

tracking-widest

text-sm

">

🧠 ANALYST TOOLKIT

</p>








{/* SECURITY TOOLS */}



<div className="mt-6">





<p className="

text-xs

text-purple-300

">

SECURITY STACK

</p>








<div className="

flex

flex-wrap

gap-2

mt-3

">







{profile.skills.tools.map(tool=>(






<span


key={tool}


className="

border

border-purple-400/30

rounded-full

px-3

py-1

text-xs

text-gray-300

"

>


{tool}


</span>






))}







</div>





</div>











{/* SOC READINESS */}


<div className="mt-8">






<p className="

text-xs

text-purple-300

">

SOC READINESS

</p>









<div className="

space-y-3

mt-3

">







{analystAreas.map(area=>(






<div


key={area.name}


className="

border

border-purple-400/20

rounded-xl

p-3

flex

justify-between

text-sm

"

>






<span>

✓ {area.name}

</span>






<span className="text-purple-300">

{area.status}

</span>







</div>






))}







</div>







</div>









{/* NETWORKING */}


<div className="mt-8">






<p className="

text-xs

text-purple-300

">

NETWORK KNOWLEDGE

</p>








<div className="

flex

gap-2

flex-wrap

mt-3

">






{profile.skills.networking.map(skill=>(






<span


key={skill}


className="

text-xs

border

border-purple-400/20

rounded

px-2

py-1

text-gray-400

"

>


{skill}


</span>






))}







</div>






</div>








</div>

);



}