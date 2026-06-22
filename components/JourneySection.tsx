"use client";


import { useNexusData } from "@/hooks/useNexusData";




export default function JourneySection(){


const profile =
useNexusData();



const experience =
profile.experience || [];


const education =
profile.education || [];





return(

<section

id="journey"

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

Journey

</h2>







<div

className="
grid
grid-cols-1
md:grid-cols-2

gap-8

mt-10
"

>







{/* EXPERIENCE */}



<div>


<h3

className="
text-2xl
text-blue-300
mb-5
"

>

Experience

</h3>






<div className="space-y-5">


{


experience.length > 0 ?



experience.map((job:any)=>(


<div

key={job.id}

className="
border
border-slate-700/60

bg-slate-900/50

rounded-xl

p-6
"

>




<p className="text-sm text-gray-500">

{job.period}

</p>




<h4 className="text-xl mt-2">

{job.role}

</h4>





<p className="text-blue-400 mt-1">

{job.company}

</p>





<p className="text-gray-400 mt-3">

{job.domain}

</p>







<ul

className="
mt-4
space-y-2
text-gray-400
"

>


{

job.details?.map(

(item:string)=>(

<li key={item}>

• {item}

</li>

)

)

}


</ul>





</div>


))


:


<p className="text-gray-500">

No experience added.

</p>



}



</div>


</div>









{/* EDUCATION */}



<div>


<h3

className="
text-2xl
text-green-300
mb-5
"

>

Education

</h3>







<div className="space-y-5">


{


education.length > 0 ?



education.map((edu:any)=>(


<div

key={edu.id}

className="
border
border-slate-700/60

bg-slate-900/50

rounded-xl

p-6
"

>





<p className="text-sm text-gray-500">

{edu.period}

</p>





<h4 className="text-xl mt-2">

{edu.degree}

</h4>





<p className="text-green-400 mt-1">

{edu.institution}

</p>





<p className="text-gray-400 mt-3">

{edu.field}

</p>







<div

className="
flex
flex-wrap
gap-2

mt-4
"

>


{


edu.focus?.map(

(item:string)=>(


<span

key={item}

className="
text-xs

border
border-green-500/40

rounded

px-3
py-1
"

>

{item}

</span>


)

)


}



</div>






</div>


))


:


<p className="text-gray-500">

No education added.

</p>



}



</div>


</div>






</div>


</section>


);


}