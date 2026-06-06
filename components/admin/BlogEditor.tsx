"use client";


import { useEffect,useState } from "react";

import { profile } from "@/data/profile";

import NexusToast from "@/components/core/NexusToast";



type Blog={

title:string;

category:string;

content:string;

date:string;

};





export default function BlogEditor(){



const [blogs,setBlogs]=useState<Blog[]>([]);

const [editing,setEditing]=useState<string|null>(null);

const [toast,setToast]=useState("");





const [form,setForm]=useState({

title:"",

category:"Cybersecurity",

content:""

});








useEffect(()=>{



const saved=

localStorage.getItem("nexus_blogs");



if(saved){


const parsed=JSON.parse(saved);


// supports old + new storage

if(Array.isArray(parsed)){


setBlogs(parsed);


}


else{


setBlogs(parsed.posts || []);


}



}



else{


setBlogs(profile.blogs.posts);


}




},[]);









function notify(message:string){


setToast(message);


setTimeout(()=>{

setToast("");

},2500);


}









function save(){



if(!form.title || !form.content){

return;

}






const post:Blog={

title:form.title,

category:form.category,

content:form.content,

date:new Date().toLocaleDateString()

};






let updated:Blog[];





if(editing){



updated=

blogs.map(blog=>

blog.title===editing

?

post

:

blog

);



notify("Article updated successfully");



}



else{



updated=[

post,

...blogs

];



notify("Article published successfully");



}








setBlogs(updated);







localStorage.setItem(

"nexus_blogs",

JSON.stringify({

...profile.blogs,

posts:updated

})

);








setEditing(null);





setForm({

title:"",

category:"Cybersecurity",

content:""

});




}











function edit(blog:Blog){



setEditing(blog.title);



setForm({

title:blog.title,

category:blog.category,

content:blog.content

});



}










function remove(title:string){





const updated=

blogs.filter(

blog=>blog.title!==title

);






setBlogs(updated);






localStorage.setItem(

"nexus_blogs",

JSON.stringify({

...profile.blogs,

posts:updated

})

);






notify("Article removed");



}









return(

<div className="

border
border-purple-400/30

rounded-xl

p-5

bg-black/40

">







<NexusToast message={toast}/>








<p className="

text-purple-300

tracking-widest

text-sm

">

BLOG CONTROL SYSTEM

</p>









<input

placeholder="Article title"

value={form.title}

onChange={e=>

setForm({

...form,

title:e.target.value

})

}

className="admin-input"

/>










<select

value={form.category}

onChange={e=>

setForm({

...form,

category:e.target.value

})

}

className="admin-input"

>



<option>Cybersecurity</option>

<option>Healthcare</option>

<option>Healthcare Security</option>

<option>Technology</option>

<option>Career Journey</option>

<option>Projects</option>



</select>











<textarea

placeholder="Write blog content"

value={form.content}

onChange={e=>

setForm({

...form,

content:e.target.value

})

}

className="admin-input min-h-40"

/>










<button

onClick={save}

className="

mt-5

border

border-purple-400

px-5

py-2

rounded

"

>


{

editing

?

"SAVE CHANGES"

:

"PUBLISH ARTICLE"

}


</button>









<div className="mt-8 space-y-4">






{blogs.map(blog=>(





<div

key={blog.title}

className="

border

border-purple-400/20

rounded-xl

p-4

bg-purple-400/5

"

>






<h3>

📝 {blog.title}

</h3>






<p className="text-xs text-gray-400">

{blog.category} • {blog.date}

</p>








<div className="flex gap-4 mt-4">






<button

onClick={()=>edit(blog)}

className="text-blue-300"

>

EDIT

</button>







<button

onClick={()=>remove(blog.title)}

className="text-red-400"

>

DELETE

</button>






</div>





</div>



))}







</div>






</div>

);


}