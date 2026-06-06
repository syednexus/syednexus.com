"use client";


import { useState } from "react";


import { useNexusData } from "@/hooks/useNexusData";




import { Mode } from "@/types/mode";






type Props={

setMode:(mode:Mode)=>void;

};







export default function NexusBlogs({

setMode

}:Props){





const profile = useNexusData();





const [category,setCategory]=useState("All");






const categories=[

"All",

...profile.blogs.categories

];









const posts:import("@/hooks/useNexusData").BlogPost[] = profile.blogs.posts;






const filtered =

category==="All"

?

posts

:

posts.filter(

blog=>blog.category===category

);









return(

<main className="

min-h-screen

bg-linear-to-br

from-[#08040f]

via-[#10172a]

to-black

text-white

font-mono

p-8

">









{/* HEADER */}



<header className="

border
border-purple-400/30

rounded-2xl

p-8

bg-purple-400/5

">






<p className="

text-purple-300

tracking-widest

text-sm

">

NEXUS KNOWLEDGE ARCHIVE

</p>






<h1 className="text-4xl mt-4">

Research & Intelligence Logs

</h1>






<p className="text-gray-400 mt-4">

Cybersecurity • Healthcare Security • Technology Research

</p>






</header>












<div className="

grid

grid-cols-12

gap-6

mt-8

">










{/* SIDEBAR */}



<section className="

col-span-12

xl:col-span-4

space-y-6

">








{/* AUTHOR */}



<div className="

border

border-purple-400/20

rounded-2xl

p-6

bg-purple-400/5

nexus-hover

">







<img

src={profile.identity.avatar || "/profile.jpg"}

alt={profile.identity.name}

className="

w-24

h-24

rounded-full

border

border-purple-400

object-cover

"

/>








<h2 className="text-2xl mt-5">

{profile.identity.name}

</h2>







<p className="

text-gray-400

text-sm

mt-3

">


{profile.identity.headline}


</p>







</div>












{/* PROJECTS */}



<div className="

border

border-purple-400/20

rounded-xl

p-5

">






<p className="text-purple-300 text-xs">

FEATURED PROJECTS

</p>








{profile.projects.slice(0,3).map(project=>(



<p

key={project.name}

className="

text-sm

mt-3

text-gray-300

"

>


⚔ {project.name}


</p>




))}






</div>











{/* EDUCATION */}



<div className="

border

border-purple-400/20

rounded-xl

p-5

">






<p className="text-purple-300 text-xs">

ACADEMIC TRACE

</p>









{profile.education.map(edu=>(




<p

key={edu.degree}

className="text-sm mt-3"

>


🎓 {edu.degree}


</p>





))}








</div>







</section>












{/* BLOG AREA */}




<section className="

col-span-12

xl:col-span-8

">







<div className="

flex

gap-3

flex-wrap

">








{categories.map(item=>(




<button


key={item}


onClick={()=>setCategory(item)}



className={

`

border

rounded-full

px-4

py-2

${

category===item

?

"border-purple-300 text-white"

:

"border-purple-400/30 text-purple-300"

}

`

}


>



{item}



</button>





))}









</div>












<div className="

grid

gap-6

mt-8

">









{filtered.length===0 && (



<div className="

border

border-gray-700

rounded-xl

p-8

text-gray-400

">


No intelligence logs published yet.


</div>




)}









{filtered.map(post=>(




<div

key={post.title}

className="

border

border-purple-400/20

rounded-xl

p-6

bg-purple-400/5

nexus-hover

"

>







<p className="text-xs text-purple-300">

{post.category}

</p>






<h2 className="text-2xl mt-3">

{post.title}

</h2>







<p className="text-xs text-gray-500 mt-2">

{post.date}

</p>








<p className="

text-gray-300

mt-5

whitespace-pre-line

">

{post.content}

</p>






</div>






))}










</div>






</section>









</div>

















</main>


);



}