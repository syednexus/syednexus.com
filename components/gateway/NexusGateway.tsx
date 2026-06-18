"use client";

import Link from "next/link";


const modules = [

{
name:"Portfolio",
desc:"Professional Identity & Journey",
path:"/portfolio",
status:"PUBLIC"
},

{
name:"SOC Defender",
desc:"Realistic Blue Team Simulations",
path:"/soc",
status:"TRAINING"
},

{
name:"Cyber Range",
desc:"Hands-on Security Labs",
path:"/lab",
status:"LAB"
},

{
name:"Games",
desc:"Cyber & Logic Challenges",
path:"/games",
status:"PLAY"
},

{
name:"Blogs",
desc:"Research & Articles",
path:"/blogs",
status:"PUBLIC"
},

{
name:"MedCore",
desc:"Healthcare Security Research",
path:"/medcore",
status:"RESEARCH"
},

{
name:"Vault",
desc:"Private Knowledge System",
path:"/vault",
status:"LOCKED"
},

{
name:"Security",
desc:"Nexus Transparency Center",
path:"/security",
status:"INFO"
}

];




export default function NexusGateway(){


return (

<main
className="
min-h-screen
bg-black
text-green-400
p-8
"
>


<header
className="
max-w-7xl
mx-auto
flex
items-center
justify-between
mb-16
"
>


<div>

<h1
className="
text-3xl
font-bold
tracking-widest
"
>

SYED NEXUS

</h1>


<p
className="
text-xs
text-gray-500
mt-1
"
>

Identity • Security • Research

</p>

</div>




<button

className="
border
border-green-700
px-5
py-2
rounded-lg
hover:bg-green-950
transition
"

>


Login


</button>



</header>






<section
className="
max-w-7xl
mx-auto
"
>



<div
className="
mb-14
"
>


<h2
className="
text-6xl
font-bold
mb-5
"
>

NEXUS OS

</h2>


<p
className="
text-gray-400
max-w-2xl
"
>

Select an environment. Explore cybersecurity,
technology, healthcare security and research.

</p>


</div>





<div
className="
grid
grid-cols-1
md:grid-cols-2
lg:grid-cols-4
gap-6
"
>


{

modules.map((module)=>(


<Link

href={module.path}

key={module.name}

className="
group
border
border-green-800/50
rounded-2xl
p-6
bg-black/40
hover:bg-green-950/20
transition
"

>


<span
className="
text-xs
text-gray-500
"
>

{module.status}

</span>



<h3
className="
text-2xl
mt-5
group-hover:text-white
"
>

{module.name}

</h3>



<p
className="
text-sm
text-gray-400
mt-3
"
>

{module.desc}

</p>



</Link>


))

}


</div>





<footer
className="
mt-20
border-t
border-green-900/40
pt-6
text-xs
text-gray-500
flex
justify-between
"
>


<span>

© 2026 Syed Nexus. All Rights Reserved.

</span>



<span>

Secure Research Environment

</span>


</footer>



</section>


</main>


);


}