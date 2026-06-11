"use client";

import { useEffect,useState } from "react";

import NexusToast from "@/components/core/NexusToast";


type Skill={

id:number;

category:string;

name:string;

};



export default function SkillEditor(){


const categories=[

"cybersecurity",

"tools",

"programming",

"pharmacy"

];



const [skills,setSkills]=useState<Skill[]>([]);

const [editing,setEditing]=useState<Skill|null>(null);

const [toast,setToast]=useState("");



const [form,setForm]=useState({

category:"cybersecurity",

name:""

});




useEffect(()=>{

load();

},[]);




async function load(){

const res =
await fetch("/api/skills");


setSkills(await res.json());

}




function notify(msg:string){

setToast(msg);

setTimeout(()=>setToast(""),2500);

}





async function save(){



const res =
await fetch("/api/skills",{

method:"POST",

credentials:"include",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

id:editing?.id,

category:form.category,

name:form.name

})

});




if(!res.ok){

notify("Unauthorized");

return;

}




notify(

editing ?

"Skill updated"

:

"Skill added"

);



setEditing(null);


setForm({

category:"cybersecurity",

name:""

});



load();


}







async function remove(id:number){



const res =
await fetch("/api/skills",{

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

notify("Unauthorized");

return;

}



notify("Skill deleted");


load();



}








return(

<div className="space-y-5">


<NexusToast message={toast}/>



<p className="text-red-300 tracking-widest text-sm">

CAPABILITY DATABASE

</p>






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


{categories.map(x=>(

<option key={x}>

{x}

</option>

))}


</select>






<input

value={form.name}

placeholder="Skill name"

onChange={e=>

setForm({

...form,

name:e.target.value

})

}

className="admin-input"

/>







<button

onClick={save}

className="border border-green-400 px-5 py-2 rounded"

>

{

editing ?

"UPDATE SKILL"

:

"ADD SKILL"

}

</button>









<div className="grid grid-cols-2 gap-4">


{categories.map(cat=>(


<div

key={cat}

className="border border-red-400/20 rounded-xl p-4"

>


<h3 className="text-red-300 mb-3">

{cat}

</h3>





{skills

.filter(x=>x.category===cat)

.map(skill=>(


<div

key={skill.id}

className="flex justify-between items-center mb-2"

>


<span>

• {skill.name}

</span>





<div className="flex gap-3">


<button

onClick={()=>{


setEditing(skill);


setForm({

category:skill.category,

name:skill.name

});


}}

>

EDIT

</button>






<button

onClick={()=>remove(skill.id)}

>

DELETE

</button>



</div>


</div>


))

}



</div>


))}


</div>



</div>

);


}