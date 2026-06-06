"use client";


import { useNexusData } from "@/hooks/useNexusData";





export default function HealthcareDossier(){


const profile = useNexusData();







return(

<div className="

border
border-emerald-400/30
rounded-2xl
p-6
bg-emerald-400/5
h-full

">









<p className="

text-emerald-300
tracking-widest
text-sm

">

MEDICAL INTELLIGENCE DOSSIER

</p>









{/* PROFILE */}


<div className="

flex
items-center
gap-5
mt-8

">



<img

src={profile.identity.avatar || "/profile.jpg"}

className="

w-24
h-24
rounded-full
border
border-emerald-400
object-cover

"

/>




<div>


<h2 className="text-2xl">

{profile.identity.name}

</h2>




<p className="text-gray-400 text-sm mt-2">

{profile.identity.headline}

</p>



</div>


</div>









{/* EDUCATION */}


<div className="mt-10">


<p className="

text-emerald-300
tracking-widest
text-xs
mb-5

">

ACADEMIC RECORDS

</p>






<div className="space-y-4">



{profile.education.map((edu,index)=>(



<div

key={index}

className="

border
border-emerald-400/20
rounded-xl
p-4
bg-black/20
nexus-hover

"

>




<h3>

🎓 {edu.degree}

</h3>




<p className="

text-gray-400
text-sm
mt-1

">

{edu.institution}

</p>





<p className="

text-gray-500
text-xs
mt-2

">

{edu.period}

</p>





</div>




))}




</div>



</div>










{/* SKILLS */}


<div className="mt-10">



<p className="

text-emerald-300
tracking-widest
text-xs
mb-5

">

CLINICAL CAPABILITY MATRIX

</p>






<div className="flex flex-wrap gap-3">



{profile.skills.pharmacy.map(skill=>(



<span

key={skill}

className="

border
border-emerald-400/30
rounded-full
px-3
py-1
text-sm

"

>


{skill}


</span>



))}




</div>



</div>









{/* CERTIFICATIONS */}



<div className="mt-10">


<p className="

text-emerald-300
tracking-widest
text-xs
mb-5

">

CERTIFICATION VAULT

</p>








<div className="space-y-3">



{profile.certifications.map(cert=>(




<div

key={cert.name}

className="

border
border-emerald-400/20
rounded-xl
p-4
bg-black/20
nexus-hover

"

>



<h3>

🛡 {cert.name}

</h3>




<p className="

text-gray-500

text-xs

">

{cert.issuer}

</p>





</div>



))}



</div>




</div>







</div>


);



}