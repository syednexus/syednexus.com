"use client";


import { useState } from "react";

import { motion } from "framer-motion";

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








const profile =
useNexusData();




const [view,setView]=
useState("profile");









const tabs=[

"profile",

"experience",

"projects",

"certs",

"filesystem",

...(access==="owner" ? ["admin"] : [])

];










return(

<motion.div


initial={{

opacity:0,

scale:.97

}}


animate={{

opacity:1,

scale:1

}}



className="

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

"

>











{/* HEADER */}


<div className="

flex

justify-between

items-center

border-b

border-green-500/30

pb-4

">








<div>







<h2 className="

text-xl

tracking-widest

">

{

access==="owner"

?

"👑 owner@nexus"

:

"⚡ root@nexus"

}

</h2>








<p className="

text-xs

text-gray-400

mt-2

">

{

access==="owner"

?

"ACCESS LEVEL: SYSTEM ADMINISTRATOR"

:

"ACCESS LEVEL: READ ONLY ROOT"

}

</p>








</div>









<div className="

text-xs

text-green-400

border

border-green-400/30

rounded-full

px-3

py-2

"

>

VAULT DECRYPTED ✓

</div>










</div>














{/* NAVIGATION */}



<div className="

flex

gap-3

flex-wrap

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

transition

${

view===tab

?

"text-white border border-green-400/40 bg-green-400/10"

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

"

/>









<h1 className="

text-3xl

mt-4

">

{profile.identity.name}

</h1>










<p className="

mt-3

text-green-200

">

{profile.identity.headline}

</p>











<p className="

mt-5

text-gray-300

whitespace-pre-line

">

{profile.identity.summary}

</p>








</section>


)}














{/* EXPERIENCE */}



{view==="experience" && (



<section className="

mt-6

space-y-4

">








{profile.experience.map((job,index)=>(








<div


key={`${job.company}-${index}`}


className="

border

border-green-500/20

rounded-xl

p-4

bg-green-400/5

"

>







<h3>

🛰 {job.role}

</h3>








<p className="

text-green-300

text-sm

">

{job.company}

</p>








<p className="

text-gray-500

text-xs

">

{job.period}

</p>








</div>








))}









</section>



)}













{/* PROJECTS */}



{view==="projects" && (



<section className="

grid

md:grid-cols-2

gap-4

mt-6

">








{profile.projects.map((project,index)=>(








<div


key={`${project.name}-${index}`}


className="

border

border-green-500/30

rounded-xl

p-4

bg-green-400/5

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








{profile.certifications.map((cert,index)=>(








<div


key={`${cert.name}-${index}`}


className="

border

border-green-500/20

rounded-xl

p-4

bg-green-400/5

"

>








🛡 {cert.name}








<p className="

text-gray-500

text-xs

mt-1

">

{cert.status}

</p>









</div>








))}








</section>



)}














{/* FILE SYSTEM */}



{view==="filesystem" && (


<div className="mt-6">


<Filesystem/>


</div>


)}












{/* OWNER ADMIN */}



{view==="admin" && access==="owner" && (


<div className="mt-6">


<AdminConsole/>


</div>


)}











</motion.div>

);



}