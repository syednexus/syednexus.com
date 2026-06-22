"use client";

import Link from "next/link";


const modules = [

{
title:"PROFILE",
desc:"Edit identity, bio, links, avatar",
href:"/vault/admin/content/profile"
},

{
title:"RESUME",
desc:"Upload and replace resume PDF",
href:"/vault/admin/content/resume"
},

{
title:"EDUCATION",
desc:"Manage academic records",
href:"/vault/admin/content/education"
},

{
title:"EXPERIENCE",
desc:"Manage career timeline",
href:"/vault/admin/content/experience"
},

{
title:"PROJECTS",
desc:"Manage portfolio projects",
href:"/vault/admin/content/projects"
},

{
title:"SKILLS",
desc:"Manage cyber skills",
href:"/vault/admin/content/skills"
},

{
title:"BLOGS",
desc:"Create and edit articles",
href:"/vault/admin/content/blogs"
},

{
title:"CERTIFICATIONS",
desc:"Update achievements",
href:"/vault/admin/content/certs"
},

{
title:"MISSIONS",
desc:"Create SOC labs and simulations",
href:"/vault/missions"
}

];



export default function ContentDashboard(){


return(

<div

className="
grid
grid-cols-1
md:grid-cols-3
gap-6
mt-12
"

>


{

modules.map(item=>(


<Link

key={item.title}

href={item.href}

className="
border
border-green-800
rounded-xl
p-6
bg-green-950/10
hover:bg-green-950/30
transition
"

>


<p className="text-xs text-gray-500">

DATABASE MODULE

</p>


<h2 className="text-2xl mt-4">

{item.title}

</h2>


<p className="text-gray-400 mt-3 text-sm">

{item.desc}

</p>


</Link>


))


}


</div>

);


}