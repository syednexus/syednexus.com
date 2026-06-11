"use client";


import { useEffect,useState } from "react";

import NexusToast from "@/components/core/NexusToast";



type Blog={

id?:number;

title:string;

category:string;

content:string;

tags?:string;

};






const defaultCategories=[

"Cybersecurity",

"Lab Research",

"Learning Notes",

"Healthcare Security",

"Projects",

"Certifications",

"Career",

"Personal Logs",

"Other"

];








export default function BlogEditor(){



const [blogs,setBlogs]=useState<Blog[]>([]);

const [customCategory,setCustomCategory]=useState("");

const [toast,setToast]=useState("");





const [form,setForm]=useState<Blog>({

title:"",

category:"Learning Notes",

content:"",

tags:""

});








useEffect(()=>{

load();

},[]);








async function load(){


const res =
await fetch("/api/blogs");


setBlogs(

await res.json()

);


}








function notify(msg:string){


setToast(msg);


setTimeout(()=>setToast(""),2500);


}










async function save(){



const finalData={

...form,

category:

form.category==="Other"

?

customCategory

:

form.category

};







const res =
await fetch("/api/blogs",{

method:"POST",

credentials:"include",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(finalData)

});








if(!res.ok){


notify("Unauthorized - login again");


return;


}








notify(

form.id ?

"Blog updated"

:

"Blog published"

);








setForm({

title:"",

category:"Learning Notes",

content:"",

tags:""

});



setCustomCategory("");



load();


}










function edit(blog:Blog){


setForm(blog);


}











async function remove(id:number|undefined){



if(!id){

return;

}






const res =
await fetch("/api/blogs",{

method:"DELETE",

credentials:"include",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

id

})

});








if(!res.ok){


notify("Unauthorized - login again");


return;


}







notify("Blog deleted");



load();


}









return(

<div className="space-y-5">



<NexusToast message={toast}/>






<p className="text-purple-300 tracking-widest">

📝 BLOG DATABASE

</p>








{

form.id &&

<p className="text-yellow-300 text-sm">

Editing: {form.title}

</p>

}










<input

className="admin-input"

placeholder="Title"

value={form.title}

onChange={e=>

setForm({

...form,

title:e.target.value

})

}

/>










<select

className="admin-input"

value={form.category}

onChange={e=>

setForm({

...form,

category:e.target.value

})

}

>


{


defaultCategories.map(cat=>(


<option

key={cat}

value={cat}

>

{cat}

</option>


))

}


</select>










{

form.category==="Other"

&&

<input

className="admin-input"

placeholder="Custom category"

value={customCategory}

onChange={e=>setCustomCategory(e.target.value)}

/>

}









<input

className="admin-input"

placeholder="Tags"

value={form.tags}

onChange={e=>

setForm({

...form,

tags:e.target.value

})

}

/>









<textarea

className="admin-input min-h-40"

placeholder="Content"

value={form.content}

onChange={e=>

setForm({

...form,

content:e.target.value

})

}

/>









<button

onClick={save}

className="

border

border-green-400

px-5

py-2

rounded-lg

text-green-300

hover:bg-green-400/10

"

>

{

form.id ?

"UPDATE BLOG"

:

"PUBLISH BLOG"

}

</button>











<div className="space-y-3 pt-5">


{


blogs.map(blog=>(



<div

key={blog.id}

className="

border

border-purple-400/20

rounded-xl

p-4

bg-purple-400/5

flex

justify-between

items-center

"

>






<div>


<p className="text-purple-200">

📝 {blog.title}

</p>



<p className="text-xs text-gray-400">

{blog.category}

</p>


</div>









<div className="flex gap-3">




<button

onClick={()=>edit(blog)}

className="

border

border-yellow-400

px-3

py-1

rounded

text-yellow-300

hover:bg-yellow-400/10

"

>

EDIT

</button>







<button

onClick={()=>remove(blog.id)}

className="

border

border-red-400

px-3

py-1

rounded

text-red-300

hover:bg-red-400/10

"

>

DELETE

</button>




</div>






</div>


))

}



</div>





</div>

);



}