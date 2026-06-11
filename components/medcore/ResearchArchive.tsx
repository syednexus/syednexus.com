"use client";


import { motion } from "framer-motion";

import { useNexusData } from "@/hooks/useNexusData";





export default function ResearchArchive(){



const profile = useNexusData();






const projects =

(profile.projects || []).filter(project=>

project.category==="Healthcare" ||

project.category==="Cybersecurity"

);








const archive =

projects.length > 0

?

projects

:

[

{

name:"Healthcare Cybersecurity Research",

status:"ACTIVE",

description:
"Research focused on protecting healthcare environments, clinical systems and sensitive patient information.",

technologies:[

"Security Governance",

"Risk Management",

"Healthcare Data",

"Compliance"

]

},


{

name:"Digital Health Security",

status:"RESEARCH",

description:
"Exploring cybersecurity principles applied to healthcare infrastructure and pharmaceutical technology.",

technologies:[

"Cybersecurity",

"Privacy",

"Threat Analysis",

"Data Protection"

]

}

];









return(

<motion.div


initial={{

opacity:0,

x:20

}}


animate={{

opacity:1,

x:0

}}


className="

h-full

border

border-purple-400/30

rounded-2xl

bg-black/40

p-6

font-mono

shadow-lg

shadow-purple-500/10

nexus-hover

"

>








<p className="

text-purple-300

tracking-widest

text-sm

">

🔬 RESEARCH INTELLIGENCE ARCHIVE

</p>









<p className="

text-xs

text-gray-400

mt-3

">

Healthcare security projects and research exploration

</p>











<div className="

space-y-5

mt-8

"

>









{archive.map((project,index)=>(








<motion.div


key={`${project.name}-${index}`}


whileHover={{

scale:1.03

}}


className="

border

border-purple-400/20

rounded-xl

p-4

bg-purple-400/5

"

>









<div className="

flex

justify-between

gap-5

"

>









<h2>

🧪 {project.name}

</h2>









<span className="

text-xs

text-purple-300

"

>

{project.status}

</span>








</div>











<p className="

text-sm

text-gray-400

mt-3

"

>

{project.description}

</p>











<div className="

flex

flex-wrap

gap-2

mt-4

"

>









{(project.technologies || []).map((item,i)=>(









<span


key={`${item}-${i}`}


className="

text-xs

border

border-purple-400/20

rounded-full

px-3

py-1

text-purple-200

"

>

{item}

</span>









))}










</div>









</motion.div>









))}









</div>








</motion.div>

);



}