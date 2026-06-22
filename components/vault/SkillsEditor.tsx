"use client";

import { useEffect,useState } from "react";


type Skill={

id?:number;

category:string;

name:string;

};



export default function SkillsEditor(){


const empty={

category:"",
name:""

};



const [skills,setSkills]=useState<Skill[]>([]);

const [form,setForm]=useState<Skill>(empty);

const [status,setStatus]=useState("");





async function load(){


const res =
await fetch("/api/skills");


const data =
await res.json();


setSkills(data);


}






useEffect(()=>{

load();

},[]);







async function save(){


const res =
await fetch("/api/skills",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(form)

});





if(res.ok){


setStatus("Skill saved");

setForm(empty);

load();


}

else{


setStatus("Save failed");


}


}








async function remove(id:number){


await fetch("/api/skills",{

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
space-y-5
">


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



<input

placeholder="Skill Name"

value={form.name}

onChange={(e)=>

setForm({

...form,

name:e.target.value

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

SAVE SKILL

</button>


<p>{status}</p>


</div>









<div className="
mt-10
grid
grid-cols-1
md:grid-cols-3
gap-5
">


{

skills.map(skill=>(


<div

key={skill.id}

className="
border
border-green-900
rounded
p-5
"

>


<p className="text-gray-500">

{skill.category}

</p>



<h2 className="text-xl">

{skill.name}

</h2>





<div className="flex gap-5 mt-5">


<button

onClick={()=>

setForm(skill)

}

>

EDIT

</button>



<button

onClick={()=>

remove(skill.id!)

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