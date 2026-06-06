"use client";


import { useState } from "react";

import { useNexusData } from "@/hooks/useNexusData";

import { AccessLevel } from "@/types/access";


import Filesystem from "./Filesystem";

import AdminConsole from "@/components/admin/AdminConsole";






type Props={

access:AccessLevel;

};






export default function RootPanel({

access

}:Props){



const profile = useNexusData();


const [view,setView]=useState("profile");





const tabs=[

"profile",

"projects",

"certs",

"filesystem",

...(access==="owner" ? ["admin"] : [])

];








return(

<div className="

w-full
max-w-5xl

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


{

access==="owner"

?

"owner@nexus"

:

"root@nexus"

}


</h2>




<p className="text-xs">


{

access==="owner"

?

"ACCESS LEVEL: SYSTEM OWNER"

:

"ACCESS LEVEL: READ ONLY"

}


</p>



</div>






<div>

VAULT: DECRYPTED ✓

</div>





</div>











{/* NAV */}



<div className="

flex
gap-5

mt-5

border-b
border-green-500/20

pb-4

">






{tabs.map(tab=>(



<button

key={tab}

onClick={()=>setView(tab)}

className={

`

px-3

py-1

rounded

nexus-hover

${

view===tab

?

"text-white border border-green-400/40"

:

"text-green-600"

}

`

}

>


{tab.toUpperCase()}


</button>




))}






</div>









{/* PROFILE */}


{view==="profile" && (

<section className="mt-6">






<img

src={profile.identity.avatar || "/profile.jpg"}

alt={profile.identity.name}

className="

w-24
h-24

rounded-full

border
border-green-400

object-cover

nexus-hover

"

/>







<h1 className="text-3xl mt-3">


{profile.identity.name}


</h1>







<p className="mt-3 text-green-200">


{profile.identity.headline}


</p>







<p className="

mt-5

text-gray-300

whitespace-pre-line

">


{profile.identity.summary}


</p>








<div className="mt-8">



<p className="text-xs">

EDUCATION

</p>






<div className="space-y-3 mt-3">


{profile.education.map(item=>(



<div

key={item.degree}

className="

border
border-green-500/20

rounded-xl

p-4

bg-green-400/5

nexus-hover

"

>



<h3>

🎓 {item.degree}

</h3>




<p className="text-gray-400 text-sm">

{item.institution}

</p>



</div>




))}


</div>






</div>





</section>

)}









{/* PROJECTS */}



{view==="projects" && (


<section className="

grid

grid-cols-2

gap-4

mt-6

">






{profile.projects.map(project=>(



<div

key={project.name}

className="

border
border-green-500/30

rounded-xl

p-4

bg-green-400/5

nexus-hover

"

>



<h3>

⚔ {project.name}

</h3>





<p className="

text-gray-400

text-sm

mt-2

">


{project.description}


</p>





</div>




))}






</section>

)}









{/* CERTIFICATIONS */}



{view==="certs" && (



<section className="

mt-6

space-y-3

">






{profile.certifications.map(cert=>(




<div

key={cert.name}

className="

border
border-green-500/20

rounded-xl

p-4

bg-green-400/5

nexus-hover

"

>



🛡 {cert.name}




<p className="

text-gray-500

text-xs

">


{cert.status}


</p>




</div>





))}






</section>


)}










{/* FILESYSTEM */}


{view==="filesystem" && (

<div className="mt-6">

<Filesystem/>

</div>

)}









{/* ADMIN */}



{view==="admin" && access==="owner" && (

<div className="mt-6">

<AdminConsole/>

</div>

)}








</div>


);


}