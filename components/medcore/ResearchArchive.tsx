"use client";


import { useNexusData } from "@/hooks/useNexusData";






export default function ResearchArchive(){



const profile = useNexusData();





const projects =

profile.projects.filter(

project=>project.category==="Healthcare"

);










return(

<div className="

h-full

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

PHARMA PROJECT ARCHIVE

</p>











<div className="

space-y-5

mt-6

">








{projects.map(project=>(







<div


key={project.name}


className="

border
border-purple-400/20

rounded-xl

p-4

bg-purple-400/5

nexus-hover

"

>








<div className="

flex

justify-between

gap-5

">







<h2>

{project.name}

</h2>







<span className="

text-xs

text-purple-300

">

{project.status}

</span>







</div>











<p className="

text-sm

text-gray-400

mt-3

">


{project.description}


</p>












<div className="

flex

flex-wrap

gap-2

mt-4

">







{project.technologies.map(item=>(







<span


key={item}


className="

text-xs

border

border-purple-400/20

rounded

px-2

py-1

"

>


{item}


</span>








))}









</div>








</div>








))}










</div>








</div>


);



}