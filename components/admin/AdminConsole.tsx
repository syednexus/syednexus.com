"use client";


import { useState } from "react";

import { motion } from "framer-motion";


import { useNexusData } from "@/hooks/useNexusData";

import ActivityTimeline from "@/components/ActivityTimeline";
import IdentityEditor from "./IdentityEditor";
import EducationEditor from "./EducationEditor";
import CertificationEditor from "./CertificationEditor";
import ProjectEditor from "./ProjectEditor";
import BlogEditor from "./BlogEditor";
import PasswordManager from "./PasswordManager";
import ExperienceEditor from "./ExperienceEditor";
import SkillEditor from "./SkillEditor";
import BackupManager from "@/components/admin/BackupManager";
import AiMemoryEditor from "./AiMemoryEditor";






type Module =

"home" |
"identity" |
"education" |
"experience" |
"skills" |
"certs" |
"projects" |
"blogs" |
"ai" |
"backup" |
"security";









export default function AdminConsole(){







const profile = useNexusData();




const [active,setActive] =
useState<Module>("home");










const modules:{

id:Module;

icon:string;

name:string;

desc:string;

}[]=[








{
id:"identity",
icon:"👤",
name:"Identity Manager",
desc:"Update personal profile"
},







{
id:"education",
icon:"🎓",
name:"Education Manager",
desc:"Manage academic timeline"
},







{
id:"experience",
icon:"💼",
name:"Career Manager",
desc:"Manage work history"
},







{
id:"skills",
icon:"🧠",
name:"Capability Matrix",
desc:"Manage skills database"
},








{
id:"certs",
icon:"🛡",
name:"Certification Vault",
desc:"Manage credentials"
},








{
id:"projects",
icon:"⚔",
name:"Project Database",
desc:"Manage security projects"
},








{
id:"blogs",
icon:"📝",
name:"Blog Intelligence",
desc:"Publish research logs"
},


{
id:"ai",
icon:"🧠",
name:"Nexus AI Memory",
desc:"Manage AI knowledge and behaviour"
},





{
id:"backup",
icon:"💾",
name:"Nexus Backup",
desc:"Export / restore system"
},








{
id:"security",
icon:"🔐",
name:"Security Settings",
desc:"Owner credentials"
}








];









return(

<motion.div


initial={{

opacity:0,

scale:.98

}}


animate={{

opacity:1,

scale:1

}}



className="

border

border-red-400/30

rounded-2xl

bg-black/50

p-6

font-mono

shadow-lg

shadow-red-500/10

"

>











{/* HEADER */}



<div className="

flex

justify-between

items-center

"

>








<p className="

text-red-300

tracking-widest

text-sm

">

👑 NEXUS COMMAND CENTER

</p>









<button


onClick={()=>setActive("home")}


className="

text-gray-400

text-xs

hover:text-white

"

>

HOME

</button>









</div>














{/* OWNER */}



<div className="

flex

gap-5

items-center

mt-8

border

border-red-400/20

rounded-xl

p-5

bg-red-400/5

"

>








<img


src={profile.identity.avatar || "/profile.jpg"}


alt={profile.identity.name}


className="

w-20

h-20

rounded-full

border

border-red-400

object-cover

"

/>









<div>








<h2 className="text-2xl">

{profile.identity.name}

</h2>








<p className="

text-gray-400

text-sm

mt-1

">

SYSTEM OWNER

</p>








<p className="

text-green-400

text-xs

mt-2

">

● ADMIN SESSION ACTIVE

</p>








</div>










</div>















{/* DASHBOARD */}



{active==="home" && (

<>







<div className="

grid

md:grid-cols-4

gap-4

mt-8

"

>









<Stat

title="PROJECTS"

value={profile.projects.length}

/>








<Stat

title="CERTS"

value={profile.certifications.length}

/>









<Stat

title="BLOGS"

value={profile.blogs.posts.length}

/>








<Stat

title="SKILLS"

value={

Object.values(profile.skills)

.flat()

.length

}

/>




<div className="
mt-8
w-full
">

<ActivityTimeline/>

</div>



</div>












<div className="

grid

md:grid-cols-2

gap-4

mt-8

"

>








{modules.map(item=>(









<button


key={item.id}


onClick={()=>setActive(item.id)}


className="

border

border-red-400/20

rounded-xl

p-5

text-left

bg-black/20

nexus-hover

"

>









<h3>

{item.icon} {item.name}

</h3>









<p className="

text-sm

text-gray-400

mt-2

">

{item.desc}

</p>








</button>








))}









</div>

</>

)}














{/* MODULE AREA */}


<div className="mt-8">








{active==="identity" && <IdentityEditor/>}



{active==="education" && <EducationEditor/>}



{active==="experience" && <ExperienceEditor/>}



{active==="skills" && <SkillEditor/>}



{active==="certs" && <CertificationEditor/>}



{active==="projects" && <ProjectEditor/>}



{active==="blogs" && <BlogEditor/>}



{active==="ai" && <AiMemoryEditor/>}



{active==="backup" && <BackupManager/>}



{active==="security" && <PasswordManager/>}









</div>








</motion.div>

);



}













function Stat({

title,

value

}:{

title:string;

value:number;

}){





return(

<div className="

border

border-red-400/20

rounded-xl

p-4

bg-red-400/5

"

>







<p className="

text-xs

text-gray-400

">

{title}

</p>







<h2 className="

text-3xl

text-red-300

mt-2

">

{value}

</h2>






</div>

);



}