"use client";


import { motion } from "framer-motion";

import { useNexusData } from "@/hooks/useNexusData";





type Activity={

icon:string;

title:string;

type:string;

date:string;

};







export default function ActivityFeed(){



const profile = useNexusData();







const activities:Activity[]=[







...profile.certifications.map(cert=>({

icon:"🛡",

title:cert.name,

type:"Certification",

date:cert.status

})),









...profile.projects.map(project=>({

icon:"⚔",

title:project.name,

type:"Project",

date:project.status

})),









...profile.education.map(edu=>({

icon:"🎓",

title:edu.degree,

type:"Education",

date:edu.period

})),










...profile.blogs.posts.map(blog=>({

icon:"📝",

title:blog.title,

type:"Research Log",

date:blog.date

}))







];









return(

<motion.div


initial={{

opacity:0,

x:20

}}


animate={{

opacity:1,

x:0

}}



className="

border
border-blue-400/30

rounded-2xl

p-6

bg-blue-400/5

font-mono

nexus-hover

"

>









<p className="

text-blue-300

tracking-widest

text-sm

">

LIVE ACTIVITY FEED

</p>










<div className="

mt-6

space-y-4

">









{activities.map((item,index)=>(






<div

key={index}

className="

border-l-2

border-blue-400/40

pl-4

"

>








<p>

{item.icon} {item.title}

</p>








<div className="

text-xs

text-gray-500

mt-1

">



{item.type} • {item.date}



</div>








</div>






))}









</div>








</motion.div>


);



}