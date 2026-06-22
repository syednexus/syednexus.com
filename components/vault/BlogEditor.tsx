"use client";

import { useEffect,useState } from "react";



type Blog={

id?:number;

title:string;

category:string;

content:string;

tags:string;

};







export default function BlogEditor(){


const empty={

title:"",

category:"Learning Notes",

content:"",

tags:""

};



const [blogs,setBlogs]=useState<Blog[]>([]);

const [form,setForm]=useState<Blog>(empty);

const [status,setStatus]=useState("");








async function load(){


const res =
await fetch("/api/blogs");


const data =
await res.json();


setBlogs(data);


}








useEffect(()=>{

load();

},[]);









async function save(){



setStatus("Saving...");



const res =
await fetch("/api/blogs",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(form)

});





if(res.ok){


setStatus("BLOG SAVED");

setForm(empty);

load();


}

else{


setStatus("SAVE FAILED");


}



}










async function remove(id:number){



await fetch("/api/blogs",{

method:"DELETE",

body:JSON.stringify({

id

})

});



load();



}











return(

<div className="mt-10">



<div className="
border
border-green-800
rounded-xl
p-6
space-y-5
">





<input

placeholder="Title"

value={form.title}

onChange={(e)=>

setForm({

...form,

title:e.target.value

})

}

className="
w-full
bg-black
border
border-green-800
p-3
"

/>






<input

placeholder="Category"

value={form.category}

onChange={(e)=>

setForm({

...form,

category:e.target.value

})

}

className="
w-full
bg-black
border
border-green-800
p-3
"

/>








<textarea

placeholder="Blog Content"

value={form.content}

onChange={(e)=>

setForm({

...form,

content:e.target.value

})

}

className="
w-full
h-60
bg-black
border
border-green-800
p-3
"

/>









<input

placeholder="Tags"

value={form.tags}

onChange={(e)=>

setForm({

...form,

tags:e.target.value

})

}

className="
w-full
bg-black
border
border-green-800
p-3
"

/>








<button

onClick={save}

className="
border
border-green-600
px-6
py-3
hover:bg-green-950
"

>

SAVE BLOG

</button>



<p>

{status}

</p>


</div>











<div className="
mt-10
space-y-5
">


{


blogs.map(blog=>(


<div

key={blog.id}

className="
border
border-green-900
rounded-xl
p-5
"

>


<p className="text-gray-500">

{blog.category}

</p>



<h2 className="text-xl">

{blog.title}

</h2>




<p className="
text-sm
text-gray-400
mt-3
">

{blog.tags}

</p>





<div className="
flex
gap-5
mt-5
">


<button

onClick={()=>

setForm(blog)

}

>

EDIT

</button>





<button

onClick={()=>

remove(blog.id!)

}

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