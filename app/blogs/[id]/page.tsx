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

<div className="pt-32 px-10">

Loading...

</div>

);




return(

<main className="pt-32 px-8 md:px-32">


<p className="text-blue-400">

{blog.category}

</p>



<h1 className="text-5xl font-bold mt-5">

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