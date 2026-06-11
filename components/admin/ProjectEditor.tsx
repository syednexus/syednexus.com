"use client";

import {useEffect,useState} from "react";
import NexusToast from "@/components/core/NexusToast";


type Project={

id?:number;

name:string;

category:string;

status:string;

description:string;

technologies:string;

};





export default function ProjectEditor(){



const [projects,setProjects]=useState<Project[]>([]);

const [editing,setEditing]=useState<Project|null>(null);

const [toast,setToast]=useState("");




const [form,setForm]=useState({

name:"",

category:"",

status:"Active",

description:"",

technologies:""

});






useEffect(()=>{

load();

},[]);








async function load(){


const res =
await fetch("/api/projects");


setProjects(

await res.json()

);


}









function notify(msg:string){


setToast(msg);


setTimeout(()=>setToast(""),2500);


}









async function save(){



const res =
await fetch("/api/projects",{

method:"POST",

credentials:"include",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

id:editing?.id,

...form

})

});







if(!res.ok){


notify("Unauthorized - login again");


return;


}







notify(

editing ?

"Project updated"

:

"Project saved"

);






setEditing(null);





setForm({

name:"",

category:"",

status:"Active",

description:"",

technologies:""

});





load();


}










function edit(project:Project){



setEditing(project);



setForm({

name:project.name || "",

category:project.category || "",

status:project.status || "",

description:project.description || "",

technologies:project.technologies || ""

});


}









async function remove(id:number){



const res =
await fetch("/api/projects",{

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





notify("Project deleted");



load();


}











return(

<div className="space-y-5">



<NexusToast message={toast}/>





<p className="text-orange-300 tracking-widest">

⚔ PROJECT DATABASE

</p>






{

editing && (

<p className="text-yellow-300 text-sm">

Editing: {editing.name}

</p>

)

}








{Object.keys(form).map(key=>(


<input

key={key}

value={form[key as keyof typeof form]}

placeholder={key}


onChange={e=>

setForm({

...form,

[key]:e.target.value

})

}


className="admin-input"

/>


))}








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

editing ?

"UPDATE PROJECT"

:

"SAVE PROJECT"

}


</button>









<div className="space-y-3">



{


projects.map(project=>(




<div

key={project.id}


className="

border

border-orange-400/20

rounded-xl

p-4

bg-orange-400/5


flex

justify-between

items-center


"

>





<div>


<p className="text-orange-200">

⚔ {project.name}

</p>



<p className="text-xs text-gray-400">

{project.category} • {project.status}

</p>




<p className="text-xs text-gray-500 mt-1">

{project.technologies}

</p>



</div>










<div className="flex gap-3">



<button

onClick={()=>edit(project)}

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

onClick={()=>remove(project.id!)}

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