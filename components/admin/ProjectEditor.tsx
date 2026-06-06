"use client";


import { useEffect, useState } from "react";

import { profile } from "@/data/profile";

import NexusToast from "@/components/core/NexusToast";





type Project={

name:string;

category:string;

status:string;

description:string;

technologies:string[];

};








export default function ProjectEditor(){





const [projects,setProjects]=useState<Project[]>([]);


const [editing,setEditing]=useState<string|null>(null);


const [toast,setToast]=useState("");






const [form,setForm]=useState({

name:"",

category:"Cybersecurity",

status:"Active",

description:"",

technologies:""

});











useEffect(()=>{



const saved=

localStorage.getItem("nexus_projects");



if(saved){


setProjects(JSON.parse(saved));


}


else{


setProjects(profile.projects);


}



},[]);










function notify(message:string){



setToast(message);



setTimeout(()=>{

setToast("");

},2500);



}











function save(){





if(!form.name){

return;

}







const project:Project={

name:form.name,

category:form.category,

status:form.status,

description:form.description,

technologies:

form.technologies

.split(",")

.map(x=>x.trim())

};








let updated:Project[];







if(editing){



updated=

projects.map(p=>

p.name===editing

?

project

:

p

);




notify("Project updated successfully");



}






else{



updated=[

project,

...projects

];



notify("Project added successfully");



}









setProjects(updated);






localStorage.setItem(

"nexus_projects",

JSON.stringify(updated)

);








setEditing(null);







setForm({

name:"",

category:"Cybersecurity",

status:"Active",

description:"",

technologies:""

});




}













function edit(project:Project){






setEditing(project.name);





setForm({

name:project.name,

category:project.category,

status:project.status,

description:project.description,

technologies:

project.technologies.join(", ")

});





}












function remove(name:string){






const updated=

projects.filter(

p=>p.name!==name

);







setProjects(updated);







localStorage.setItem(

"nexus_projects",

JSON.stringify(updated)

);





notify("Project removed");





}













return(

<div className="

border
border-orange-400/30

rounded-xl

p-5

bg-black/40

">









<NexusToast message={toast}/>











<p className="

text-orange-300

tracking-widest

text-sm

">

PROJECT DATABASE MANAGER

</p>












<input

placeholder="Project name"

value={form.name}

onChange={e=>

setForm({

...form,

name:e.target.value

})

}

className="admin-input"

/>









<input

placeholder="Category"

value={form.category}

onChange={e=>

setForm({

...form,

category:e.target.value

})

}

className="admin-input"

/>









<input

placeholder="Status"

value={form.status}

onChange={e=>

setForm({

...form,

status:e.target.value

})

}

className="admin-input"

/>











<textarea

placeholder="Description"

value={form.description}

onChange={e=>

setForm({

...form,

description:e.target.value

})

}

className="admin-input min-h-32"

/>












<input

placeholder="Technologies comma separated"

value={form.technologies}

onChange={e=>

setForm({

...form,

technologies:e.target.value

})

}

className="admin-input"

/>











<button

onClick={save}

className="

mt-5

border

border-orange-400

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

"ADD PROJECT"

}




</button>













<div className="

mt-8

space-y-4

">







{projects.map(project=>(








<div


key={project.name}


className="

border

border-orange-400/20

rounded-xl

p-4

bg-orange-400/5

"

>








<h3>

⚔ {project.name}

</h3>









<p className="

text-gray-400

text-sm

">

{project.description}

</p>











<div className="flex gap-4 mt-4">









<button

onClick={()=>edit(project)}

className="text-blue-300"

>

EDIT

</button>










<button

onClick={()=>remove(project.name)}

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