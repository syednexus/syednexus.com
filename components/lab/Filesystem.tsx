"use client";

import { profile } from "@/data/profile";


export default function Filesystem(){


const folders = [

{
icon:"👤",
name:"identity",
items:[
profile.identity.name,
profile.identity.headline
]
},


{
icon:"🎓",
name:"education",
items:
profile.education.map(
edu=>edu.degree
)
},


{
icon:"🛡",
name:"certifications",
items:
profile.certifications.map(
cert=>cert.name
)
},


{
icon:"⚙",
name:"skills",
items:[
...profile.skills.cybersecurity,
...profile.skills.tools
]
},


{
icon:"📂",
name:"projects",
items:
profile.projects.map(
project=>project.name
)
}


];




return(

<div className="
border
border-green-400/30
rounded-2xl
bg-black/50
p-6
font-mono
h-full
">


<p className="
text-green-300
tracking-widest
text-sm
">

ROOT FILESYSTEM

</p>



<div className="
mt-6
space-y-5
">


{folders.map(folder=>(


<div

key={folder.name}

className="
border
border-green-400/20
rounded-xl
p-4
bg-green-400/5
"

>


<h3 className="
text-green-300
">

{folder.icon} /{folder.name}

</h3>



<div className="
mt-3
space-y-1
">


{folder.items.map(item=>(


<p

key={item}

className="
text-xs
text-gray-300
"

>

↳ {item}

</p>


))}


</div>


</div>


))}


</div>



</div>

)

}