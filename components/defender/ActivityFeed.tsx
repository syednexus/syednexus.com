"use client";


import { useNexusData } from "@/hooks/useNexusData";




type BlogPost = {

id:number;

title:string;

category:string;

content:string;

date:string | Date;

};

export default function ActivityFeed(){



const profile =
useNexusData();





// normalize blogs


const rawPosts =
profile.blogs?.posts || [];




const posts:BlogPost[] = (

Array.isArray(rawPosts)

?

rawPosts

:

Object.values(rawPosts).flat()

)

.filter((post:any)=>

post &&

post.title

) as BlogPost[];









const activity = [



...profile.certifications.map(cert=>({

icon:"🏆",

title:cert.name,

type:"Certification"

})),





...profile.projects.map(project=>({

icon:"⚔",

title:project.name,

type:"Project"

})),






...posts.map(post=>({

icon:"📚",

title:post.title,

type:post.category || "Blog"

}))



];










return(

<div className="

border

border-cyan-400/20

rounded-2xl

p-6

bg-cyan-400/5

">







<p className="

text-cyan-300

tracking-widest

text-sm

">

LIVE ACTIVITY FEED

</p>









<div className="

mt-5

space-y-4

">







{activity.map((item,index)=>(






<div


key={`${item.title}-${index}`}


className="

border

border-white/10

rounded-xl

p-4

bg-black/30

"

>








<p className="

text-white

">

{item.icon} {item.title}

</p>






<p className="

text-xs

text-gray-500

mt-1

">

{item.type}

</p>







</div>






))}







</div>








</div>

);



}