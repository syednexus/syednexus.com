"use client";

import { useState } from "react";


export default function RootPanel(){


const [view,setView]=useState("profile");


const skills=[

["Linux",80],
["Networking",70],
["Security Fundamentals",75],
["Python",50],
["Web Security",45]

];



return(

<div className="
w-full
max-w-4xl
border
border-green-400/40
bg-black/50
rounded-2xl
p-6
font-mono
text-green-300
shadow-lg
shadow-green-500/10
">



{/* HEADER */}


<div className="
flex
justify-between
border-b
border-green-500/30
pb-4
">


<div>

<h2 className="text-xl">

root@nexus

</h2>


<p className="text-xs">

ACCESS LEVEL: ADMINISTRATOR

</p>

</div>


<div>

VAULT: DECRYPTED ✓

</div>


</div>






{/* NAV */}


<div className="
flex
gap-4
mt-5
border-b
border-green-500/20
pb-4
">


<button onClick={()=>setView("profile")}>

PROFILE

</button>



<button onClick={()=>setView("projects")}>

PROJECTS

</button>



<button onClick={()=>setView("certs")}>

CERTIFICATIONS

</button>



</div>









{/* PROFILE */}


{view==="profile" && (

<section className="mt-6">


<p className="text-xs text-green-500">

IDENTITY MODULE

</p>


<h1 className="
text-3xl
mt-2
">

Syed Mohiuddin

</h1>



<p className="mt-3 text-green-200">

Bachelor of Pharmacy → Master of Cyber Security

</p>



<p className="mt-3 text-gray-300">

Exploring Security Operations, Networking,
Infrastructure and Security Engineering.

</p>







<div className="
space-y-4
mt-8
">


<p className="text-xs text-green-500">

SKILL MATRIX

</p>



{skills.map(skill=>(


<div key={skill[0]}>


<div className="flex justify-between">


<span>

{skill[0]}

</span>


<span>

{skill[1]}%

</span>


</div>




<div className="
h-2
bg-green-950
rounded
">


<div

style={{

width:`${skill[1]}%`

}}

className="
h-full
bg-green-400
rounded
"

/>


</div>



</div>


))}


</div>


</section>

)}









{/* PROJECTS */}


{view==="projects" && (

<section className="mt-6">


<h2 className="text-xl">

PROJECT DATABASE

</h2>



<div className="
grid
grid-cols-2
gap-4
mt-5
">



<div className="
border
border-green-500/30
rounded
p-4
">

<h3>Syed Nexus Platform</h3>

<p className="text-sm mt-2">

Next.js cybersecurity portfolio with interactive terminal lab.

</p>

</div>





<div className="
border
border-green-500/30
rounded
p-4
">

<h3>Cybersecurity Labs</h3>

<p className="text-sm mt-2">

Linux, networking, web security and security tools practice.

</p>

</div>





<div className="
border
border-green-500/30
rounded
p-4
">

<h3>Infrastructure Learning</h3>

<p className="text-sm mt-2">

Virtualization, servers and monitoring concepts.

</p>

</div>




</div>


</section>

)}








{/* CERTS */}


{view==="certs" && (

<section className="mt-6">


<h2 className="text-xl">

CERTIFICATION VAULT

</h2>



<ul className="
mt-5
space-y-3
">


<li>

✓ Cisco Foundations of Cybersecurity

</li>


<li>

✓ TryHackMe Cyber Security 101

</li>



</ul>


</section>


)}









{/* LINKS */}


<div className="
flex
gap-4
mt-8
">



<a

href="/resume.pdf"

download="Syed_Mohiuddin_Resume.pdf"

className="
border
border-green-400
px-4
py-2
rounded
hover:bg-green-400/10
"

>

Download Resume

</a>






<a

href="https://github.com/syednexus"

target="_blank"

className="
border
border-green-400
px-4
py-2
rounded
hover:bg-green-400/10
"

>

Github

</a>






<a

href="https://linkedin.com/in/syedmohiuddin7"

target="_blank"

className="
border
border-green-400
px-4
py-2
rounded
hover:bg-green-400/10
"

>

LinkedIn

</a>



</div>





</div>


);


}