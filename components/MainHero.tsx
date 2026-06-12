"use client";


import { useNexusData } from "@/hooks/useNexusData";





export default function MainHero(){



const profile =
useNexusData();



const identity =
profile.identity;







return(

<section className="pt-32 pb-10 px-8 md:px-24 lg:px-40">



<p className="text-blue-400 mb-5">

&gt; initializing syed nexus

</p>





<h1 className="text-5xl md:text-7xl font-bold tracking-tight">

{identity.name}

</h1>





<p className="mt-5 text-blue-300 text-xl">

{identity.headline}

</p>







<p className="mt-6 max-w-3xl text-gray-400 text-lg leading-8">

{identity.summary}

</p>









<div className="flex flex-wrap gap-5 mt-10">







<a

href="#lab"

className="
border
border-blue-500
rounded-lg
px-6
py-3
hover:bg-blue-500/20
transition
"

>

⚔ View Nexus Lab

</a>










<a

href="#journey"

className="
border
border-gray-700
rounded-lg
px-6
py-3
hover:border-blue-500
transition
"

>

🚀 My Journey

</a>











{

identity.linkedin &&

<a

href={identity.linkedin}

target="_blank"

rel="noopener noreferrer"

className="
border
border-cyan-400/40
rounded-lg
px-6
py-3
text-cyan-300
hover:bg-cyan-400/10
transition
"

>

🔗 LinkedIn

</a>


}










{

identity.github &&

<a

href={identity.github}

target="_blank"

rel="noopener noreferrer"

className="
border
border-purple-400/40
rounded-lg
px-6
py-3
text-purple-300
hover:bg-purple-400/10
transition
"

>

💻 GitHub

</a>


}









{

identity.resume &&


<a

href={identity.resume}

target="_blank"

rel="noopener noreferrer"

className="
border
border-green-400/40
rounded-lg
px-6
py-3
text-green-300
hover:bg-green-400/10
transition
"

>

📄 Resume

</a>



}






</div>





</section>

);



}