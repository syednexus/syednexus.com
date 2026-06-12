"use client";


import { useState } from "react";

import { useNexusData } from "@/hooks/useNexusData";




type BlogPost={

id:number;

title:string;

category:string;

content:string;

tags?:string | null;

date:string | Date;

};





const defaultCategories=[

"Cybersecurity",

"Lab Research",

"Learning Notes",

"Healthcare Security",

"Projects",

"Certifications",

"Career",

"Personal Logs"

];









export default function NexusBlogs(){



const profile =
useNexusData();




const [category,setCategory]=
useState("All");


const [search,setSearch]=
useState("");


const [selectedPost,setSelectedPost]=
useState<BlogPost|null>(null);










// SUPPORT DATABASE + STATIC BLOG FORMAT


const posts:BlogPost[] =

Array.isArray(profile.blogs)

?

profile.blogs as BlogPost[]

:

Array.isArray(profile.blogs?.posts)

?

profile.blogs.posts

:

[];









const categories=[


"All",


...Array.from(

new Set([


...defaultCategories,


...posts.map(post=>post.category)


])


)


];










const filtered =
posts.filter(post=>{


const matchCategory =

category==="All"

||

post.category===category;





const searchable=[

post.title,

post.category,

post.content,

post.tags || ""

]

.join(" ")

.toLowerCase();





return (

matchCategory

&&

searchable.includes(search.toLowerCase())

);


});









function formatDate(date:string | Date){


return new Date(date)

.toLocaleDateString();


}










if(selectedPost){


return(

<main className="min-h-screen bg-linear-to-br from-[#08040f] via-[#10172a] to-black text-white font-mono p-8">



<button

onClick={()=>setSelectedPost(null)}

className="border border-purple-400/30 rounded-xl px-5 py-2 text-purple-300 hover:bg-purple-400/10"

>

← BACK TO ARCHIVE

</button>





<article className="max-w-5xl mx-auto mt-10 border border-purple-400/20 rounded-2xl p-10 bg-purple-400/5">


<p className="text-purple-300 text-sm">

{selectedPost.category}

</p>



<h1 className="text-5xl mt-5">

{selectedPost.title}

</h1>




<p className="text-gray-500 mt-4">

{formatDate(selectedPost.date)}

</p>




<div className="mt-10 text-gray-300 leading-8 whitespace-pre-line">

{selectedPost.content}

</div>



</article>


</main>

);


}









return(

<main className="min-h-screen bg-linear-to-br from-[#08040f] via-[#10172a] to-black text-white font-mono p-8">





<header className="border border-purple-400/30 rounded-2xl p-8 bg-purple-400/5">


<p className="text-purple-300 tracking-widest text-sm">

📚 NEXUS KNOWLEDGE ARCHIVE

</p>



<h1 className="text-5xl mt-5">

Research Logs

</h1>



<p className="text-gray-400 mt-4">

Cybersecurity • Healthcare Security • Research • Learning Notes

</p>



</header>









<section className="mt-8 border border-purple-400/20 rounded-xl p-5 bg-black/30">


<input

value={search}

onChange={e=>setSearch(e.target.value)}

placeholder="Search intelligence archive..."

className="w-full bg-black border border-purple-400/30 rounded-xl px-4 py-3 text-purple-200"

/>






<div className="flex gap-3 flex-wrap mt-5">


{categories.map(item=>(


<button

key={item}

onClick={()=>setCategory(item)}

className={

`

border rounded-full px-5 py-2 transition

${

category===item

?

"border-purple-300 bg-purple-400/20"

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



</section>









<section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">


{


filtered.length===0

&&


<div className="border border-gray-700 rounded-xl p-8 text-gray-400">

No matching intelligence logs found.

</div>


}







{


filtered.map(post=>(


<article

key={post.id}

className="border border-purple-400/20 rounded-2xl p-6 bg-purple-400/5 hover:bg-purple-400/10 transition"

>



<div className="flex justify-between">


<span className="text-xs text-purple-300">

{post.category}

</span>



<span className="text-xs text-gray-500">

{formatDate(post.date)}

</span>



</div>






<h2 className="text-2xl mt-5">

{post.title}

</h2>





<p className="text-gray-400 mt-5 line-clamp-3">

{post.content.slice(0,180)}

...

</p>






<button

onClick={()=>setSelectedPost(post)}

className="mt-6 text-purple-300 text-sm hover:underline"

>

READ INTELLIGENCE →

</button>





</article>


))


}



</section>


</main>

);


}