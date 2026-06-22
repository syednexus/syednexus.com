"use client";


import { useEffect,useState } from "react";




type Project={

id?:number;

name:string;

category:string;

status:string;

description:string;

technologies:string;

};








export default function ProjectsEditor(){



const empty={

name:"",
category:"",
status:"",
description:"",
technologies:""

};



const [projects,setProjects]=useState<Project[]>([]);

const [form,setForm]=useState<Project>(empty);

const [message,setMessage]=useState("");






async function load(){


const res=
await fetch("/api/projects");


const data=
await res.json();


setProjects(data);


}







useEffect(()=>{

load();

},[]);









async function save(){


const res=

await fetch("/api/projects",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(form)

});





if(res.ok){


setMessage("Saved");

setForm(empty);

load();


}

else{


setMessage("Failed");


}


}











async function remove(id:number){


await fetch("/api/projects",{

method:"DELETE",

body:JSON.stringify({id})

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
space-y-4
">


{

[
"name",
"category",
"status",
"technologies"
].map(field=>(


<input

key={field}

placeholder={field}

value={(form as any)[field]}

onChange={(e)=>

setForm({

...form,

[field]:e.target.value

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


))

}






<textarea

placeholder="description"

value={form.description}

onChange={(e)=>

setForm({

...form,

description:e.target.value

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
"

>

SAVE PROJECT

</button>



<p>{message}</p>



</div>









<div className="mt-10 space-y-5">


{


projects.map(project=>(


<div

key={project.id}

className="
border
border-green-900
p-5
rounded
"

>


<h2 className="text-xl">

{project.name}

</h2>



<p className="text-gray-500">

{project.description}

</p>



<div className="mt-5 flex gap-5">


<button

onClick={()=>

setForm(project)

}

>

EDIT

</button>




<button

onClick={()=>

remove(project.id!)

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