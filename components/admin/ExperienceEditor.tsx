"use client";

import { useEffect,useState } from "react";
import NexusToast from "@/components/core/NexusToast";


type Experience={

id?:number;

role:string;

company:string;

period:string;

domain:string|null;

details:string;

};





export default function ExperienceEditor(){



const [experience,setExperience]=useState<Experience[]>([]);

const [editing,setEditing]=useState<Experience|null>(null);

const [toast,setToast]=useState("");




const [form,setForm]=useState({

role:"",

company:"",

period:"",

domain:"",

details:""

});







useEffect(()=>{

load();

},[]);








async function load(){


const res =
await fetch("/api/experience");


setExperience(

await res.json()

);


}








function notify(msg:string){


setToast(msg);


setTimeout(()=>setToast(""),2500);


}










async function save(){



if(!form.role){

return;

}





const res =
await fetch("/api/experience",{

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

"Experience updated"

:

"Experience added"

);






setEditing(null);




setForm({

role:"",

company:"",

period:"",

domain:"",

details:""

});





load();


}











function edit(item:Experience){



setEditing(item);



setForm({

role:item.role,

company:item.company,

period:item.period,

domain:item.domain || "",

details:item.details

});


}









async function remove(id:number){



const res =
await fetch("/api/experience",{

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







notify("Experience removed");


load();


}









return(

<div className="space-y-5">



<NexusToast message={toast}/>





<p className="text-yellow-300 tracking-widest text-sm">

💼 CAREER DATABASE MANAGER

</p>







{

editing &&

(

<p className="text-yellow-300 text-sm">

Editing: {editing.role}

</p>

)

}









{Object.keys(form).map(key=>(



<input

key={key}

placeholder={key}


value={form[key as keyof typeof form]}



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

"SAVE CHANGES"

:

"ADD EXPERIENCE"

}


</button>









<div className="space-y-3 mt-8">


{

experience.map(item=>(




<div


key={item.id}


className="

border

border-yellow-400/20

rounded-xl

p-4

bg-yellow-400/5


flex

justify-between

items-center


"

>






<div>


<h3 className="text-yellow-200">

💼 {item.role}

</h3>



<p className="text-sm text-gray-400">

{item.company}

</p>




<p className="text-xs text-gray-500">

{item.period}

</p>



</div>











<div className="flex gap-3">





<button


onClick={()=>edit(item)}


className="

border

border-blue-400

px-3

py-1

rounded

text-blue-300

hover:bg-blue-400/10

"

>

EDIT

</button>









<button


onClick={()=>remove(item.id!)}


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