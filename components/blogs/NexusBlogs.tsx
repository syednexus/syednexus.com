"use client";


import Link from "next/link";

import { useNexusData } from "@/hooks/useNexusData";






export default function NexusBlogs(){


const profile =
useNexusData();



const posts =
profile.blogs?.posts || [];









return(

<section

id="blogs"

className="
px-8
md:px-24
lg:px-40

py-10
"

>




<h2

className="
text-4xl
font-bold
"

>

Knowledge Hub

</h2>






<p

className="
mt-4
text-gray-400
"

>

Cybersecurity research, learning notes and technical documentation.

</p>











<div

className="
grid
grid-cols-1
md:grid-cols-2
lg:grid-cols-3

gap-6

mt-10
"

>


{


posts.length > 0 ?



posts.map((post:any)=>(



<Link


href={`/blogs/${post.id}`}


key={post.id}


className="
border
border-slate-700/60

bg-slate-900/50

rounded-xl

p-6

hover:border-blue-500

transition

block
"

>







<p

className="
text-xs
text-blue-400
uppercase
"

>

{post.category}

</p>








<h3

className="
text-xl
mt-3
"

>

{post.title}

</h3>








<p

className="
text-gray-500
text-sm
mt-2
"

>

{

post.date

?

new Date(post.date).toLocaleDateString()

:

""

}

</p>









<p

className="
mt-5
text-gray-400

line-clamp-5
"

>

{post.content}

</p>










<div

className="
flex
flex-wrap
gap-2

mt-5
"

>


{


post.tags
?.split(",")
.map((tag:string)=>(



<span

key={tag}

className="
border
border-blue-500/40

rounded

px-3
py-1

text-xs
text-blue-300
"

>

{tag.trim()}

</span>


))


}




</div>






<p

className="
mt-6
text-blue-400
text-sm
"

>

Read full article →

</p>





</Link>


))


:



<p className="text-gray-500">

No articles available.

</p>


}




</div>



</section>


);



}