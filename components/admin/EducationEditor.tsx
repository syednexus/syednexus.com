"use client";

import { useEffect,useState } from "react";
import NexusToast from "@/components/core/NexusToast";


type Education={

id?:number;

degree:string;

institution:string;

period:string;

field:string | null;

focus:string;

};






export default function EducationEditor(){



const [education,setEducation]=useState<Education[]>([]);

const [editing,setEditing]=useState<Education|null>(null);

const [toast,setToast]=useState("");





const [form,setForm]=useState({

degree:"",

institution:"",

period:"",

field:"",

focus:""

});







useEffect(()=>{

load();

},[]);







async function load(){


const res =
await fetch("/api/education");


setEducation(

await res.json()

);


}







function notify(msg:string){


setToast(msg);


setTimeout(()=>setToast(""),2500);


}









async function save(){



if(!form.degree){

return;

}





const res =
await fetch("/api/education",{

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

"Education updated"

:

"Education added"

);






setEditing(null);




setForm({

degree:"",

institution:"",

period:"",

field:"",

focus:""

});




load();


}









function edit(item:Education){



setEditing(item);



setForm({

degree:item.degree,

institution:item.institution,

period:item.period,

field:item.field || "",

focus:item.focus

});


}










async function remove(id:number){



const res =
await fetch("/api/education",{

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






notify("Education removed");



load();


}









return(

<div className="space-y-5">





<NexusToast message={toast}/>






<p className="text-blue-300 tracking-widest text-sm">

🎓 EDUCATION DATABASE MANAGER

</p>







{

editing &&

(

<p className="text-yellow-300 text-sm">

Editing: {editing.degree}

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

"ADD EDUCATION"

}


</button>









<div className="space-y-3 mt-8">



{

education.map(item=>(





<div


key={item.id}


className="

border

border-blue-400/20

rounded-xl

p-4

bg-blue-400/5


flex

justify-between

items-center


"

>





<div>


<h3 className="text-blue-200">

🎓 {item.degree}

</h3>




<p className="text-sm text-gray-400">

{item.institution}

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