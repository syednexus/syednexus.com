"use client";


import { useEffect,useState } from "react";

import { useParams } from "next/navigation";



export default function BlogReader(){


const {id}=useParams();

const [blog,setBlog]=useState<any>(null);



useEffect(()=>{


fetch("/api/nexus")

.then(r=>r.json())

.then(data=>{


const found =
data.blogs.posts.find(

(x:any)=>String(x.id)===String(id)

);


setBlog(found);


});


},[id]);






if(!blog)

return (

<div className="px-4 pt-24 sm:px-10 sm:pt-32">

Loading...

</div>

);




return(

<main className="px-4 pt-24 sm:px-8 sm:pt-32 md:px-20 lg:px-32">


<p className="text-blue-400">

{blog.category}

</p>



<h1 className="mt-5 text-2xl font-bold sm:text-4xl lg:text-5xl">

{blog.title}

</h1>



<p className="text-gray-500 mt-4">

{new Date(blog.date).toLocaleDateString()}

</p>




<article className="
mt-10
text-gray-300
leading-8
max-w-4xl
whitespace-pre-wrap
">


{blog.content}


</article>




<div className="mt-10 text-blue-400">

{blog.tags}

</div>


</main>


);


}