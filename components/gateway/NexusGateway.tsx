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


px-8

py-20

"

>




<section

className="

max-w-7xl

mx-auto

"

>






<div

className="mb-14"

>


<h1

className="

text-6xl

font-bold

tracking-widest

mb-5

"

>

NEXUS OS

</h1>




<p

className="

text-gray-400

max-w-3xl

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






</section>


</main>


);


}