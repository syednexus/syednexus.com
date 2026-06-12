"use client";


import { useNexusData } from "@/hooks/useNexusData";




export default function SocialLinks(){


const profile =
useNexusData();



const identity =
profile.identity;




return(

<div className="
flex
flex-wrap
gap-3
mt-5
">







{identity.linkedin && (

<a

href={identity.linkedin}

target="_blank"

rel="noopener noreferrer"

className="
border
border-blue-400/30
rounded-xl
px-4
py-2
text-blue-300
hover:bg-blue-400/10
transition
text-sm
"

>

🔗 LinkedIn

</a>

)}










{identity.github && (

<a

href={identity.github}

target="_blank"

rel="noopener noreferrer"

className="
border
border-purple-400/30
rounded-xl
px-4
py-2
text-purple-300
hover:bg-purple-400/10
transition
text-sm
"

>

💻 GitHub

</a>

)}










{identity.resume && (

<a

href={identity.resume}

target="_blank"

rel="noopener noreferrer"

download

className="
border
border-green-400/30
rounded-xl
px-4
py-2
text-green-300
hover:bg-green-400/10
transition
text-sm
"

>

📄 Download Resume

</a>

)}







</div>

);


}