const sections=[

{
name:"Projects",
api:"/api/projects",
status:"READY"
},

{
name:"Skills",
api:"/api/skills",
status:"READY"
},

{
name:"Blogs",
api:"/api/blogs",
status:"READY"
},

{
name:"Experience",
api:"/api/experience",
status:"READY"
},

{
name:"Education",
api:"/api/education",
status:"READY"
},

{
name:"Certifications",
api:"/api/certifications",
status:"READY"
}

];





export default function ContentManager(){


return(

<main

className="
min-h-screen
bg-black
text-green-400
p-10
font-mono
"

>


<section className="max-w-7xl mx-auto">


<p className="text-xs text-gray-500">

root@nexus:/admin/content#

</p>



<h1

className="
text-5xl
font-bold
mt-5
"

>

CONTENT MANAGER

</h1>



<p className="mt-5 text-gray-400">

Manage Nexus database powered content.

</p>






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


sections.map(item=>(


<div

key={item.name}

className="
border
border-green-800
rounded-xl
p-6
bg-green-950/10
"

>


<p className="text-xs">

[{item.status}]

</p>


<h2 className="text-2xl mt-4">

{item.name}

</h2>



<p className="text-gray-500 mt-3">

{item.api}

</p>



</div>


))


}


</div>


</section>


</main>


);


}