"use client";


import { useNexusData } from "@/hooks/useNexusData";





export default function CertificationsSection(){


const profile =
useNexusData();



const certifications =
profile.certifications || [];






return(

<section

id="certifications"

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

Certifications

</h2>






<p

className="
mt-4
text-gray-400
"

>

Professional learning, cybersecurity training and achievements.

</p>









<div

className="
grid
grid-cols-1
md:grid-cols-3

gap-6

mt-10
"

>



{


certifications.length > 0 ?

certifications.map((cert:any)=>(



<div

key={cert.name}

className="
border
border-slate-700/60

bg-slate-900/50

rounded-xl

p-6

hover:border-green-500

transition
"

>





<p

className="
text-xs
text-green-400
uppercase
"

>

{cert.status}

</p>






<h3

className="
text-xl
mt-3
"

>

{cert.name}

</h3>






<p

className="
mt-3
text-gray-400
"

>

{cert.issuer}

</p>







<p

className="
mt-3
text-blue-400
text-sm
"

>

{cert.category}

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


(cert.skills || [])

.map((skill:string)=>(


<span

key={skill}

className="
border
border-green-500/40

rounded

px-3
py-1

text-xs
"

>

{skill}

</span>


))


}


</div>






</div>


))

:

<p className="text-gray-500">

No certifications available.

</p>


}



</div>




</section>


);


}