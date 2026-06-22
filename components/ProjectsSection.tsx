"use client";


import { useNexusData } from "@/hooks/useNexusData";





export default function ProjectsSection(){



const profile =
useNexusData();



const projects =
profile.projects || [];








return(

<section

id="projects"

className="
px-8
md:px-24
lg:px-40

py-10
"

>


<h2

className="
text-4xl
font-bold
"

>

Projects

</h2>









<div

className="
grid
md:grid-cols-3
gap-6
mt-10
"

>


{


projects.length > 0 ?


projects.map((project:any)=>(



<div

key={project.id || project.name}

className="
border
border-slate-700/60

bg-slate-900/50

rounded-xl

p-6

hover:border-blue-500

transition
"

>





<p

className="
text-xs
text-blue-400
"

>

{project.category}

</p>






<h3

className="
text-xl
mt-3
"

>

{project.name}

</h3>







<p

className="
mt-3
text-gray-400
"

>

{project.description}

</p>









<div

className="
flex
flex-wrap
gap-2

mt-5
"

>


{


project.technologies?.map(

(tech:string)=>(


<span

key={tech}

className="
text-xs

border
border-blue-500/40

rounded

px-3
py-1

text-blue-300
"

>

{tech}

</span>


))


}



</div>









<p

className="
mt-5
text-green-400
text-sm
"

>

{project.status}

</p>







</div>



))



:



<p

className="
text-gray-500
"

>

No projects available.

</p>



}



</div>



</section>


);



}